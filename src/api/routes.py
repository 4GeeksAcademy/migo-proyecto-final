from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, RoleEnum, Pet, ClinHistory
from api.utils import generate_sitemap, APIException, send_email, check_password, set_password
from flask_cors import CORS
from base64 import b64encode
import os
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime
from clarifai.client.model import Model
import asyncio
from werkzeug.security import generate_password_hash

api = Blueprint('api', __name__)
CORS(api, supports_credentials=True)

expires_in_minutes = 10
expires_delta = timedelta(minutes=expires_in_minutes)


@api.route('/healt-check', methods=['GET'])
def handle_hello():
    return jsonify("ok"), 200


@api.route('/register', methods=['POST'])
def add_user():
    data = request.json
    email = data.get('email')
    name = data.get('name')
    lastname = data.get('lastname')
    password = data.get('password')
    salt = b64encode(os.urandom(32)).decode('utf-8')
    role = RoleEnum.admin if email == 'valen2004vega@gmail.com' else RoleEnum.general

    if not all([email, name, lastname, password]):
        return jsonify('You need an email, a name, a lastname and a password'), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 409

    user = User(email=email, name=name, lastname=lastname,
                password=set_password(password, salt), salt=salt, role=role)
    db.session.add(user)

    try:
        db.session.commit()
        return jsonify('User created'), 201
    except Exception as error:
        db.session.rollback()
        return jsonify(f'Error: {error.args}'), 500


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Faltan datos"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if not check_password(user.password, password, user.salt):
        return jsonify({"msg": "Contraseña incorrecta"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user_id": user.id}), 200


@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify({"message": f"Bienvenido, tu ID es {current_user_id}"}), 200


@api.route("/reset-password", methods=["POST"])
def reset_password():
    if request.method == 'OPTIONS':  
        return '', 200 
    body = request.json 
 
    email = body.get("email")
    user = User.query.filter_by(email=email).one_or_none()
    
    if user is None:
        return jsonify("user not found"), 404

    access_token = create_access_token(
        identity=user.email, expires_delta=expires_delta)

    message = f"""
        <p>Hola {user.name},</p>

        <p>Con este link, podrás <a href="{os.getenv("FRONTEND_URL")}password-update?token={access_token}">recuperar tu contraseña</a>.</p>

        <p>Un saludo</p>

        <p>El equipo Migo</p>
        <p><a href="{os.getenv("FRONTEND_URL")}">Migo.com</a></p>
    """

    data = {
        "subject": "Recuperación de contraseña",
        "to": email,
        "message": message
    }

    sended_email = send_email(
        data.get("subject"), data.get("to"), data.get("message"))

    if sended_email:
        return jsonify("Mensaje correctamente enviado"), 200
    else:
        api.logger.error(f"Error al enviar el correo a {email}")
        return jsonify("Error en el envío del correo"), 500

@api.route('/pet', methods=['POST'])
@jwt_required()
def add_pet():
    owner_id = get_jwt_identity()
    user = User.query.get(owner_id)
    if not user:
        return jsonify({"message": "Dueño no encontrado"}), 404

    data = request.get_json()
    name = data.get('name')
    species = data.get('species')
    breed = data.get('breed')
    age = data.get('age')
    wheight = data.get('wheight')

    if not name:
        return jsonify({"message": "Necesita al menos el nombre de la mascota"}), 400

    if Pet.query.filter_by(name=name, owner_id=owner_id).first():
        return jsonify({"message": "Ya registraste una mascota con este nombre"}), 409

    pet = Pet(name=name, species=species, breed=breed,
              age=int(age) if age else None,
              wheight=float(wheight) if wheight else None,
              owner_id=owner_id)

    db.session.add(pet)
    try:
        db.session.commit()
        return jsonify({"message": "Mascota añadida"}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 500


@api.route('/pet/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_pet_by_id_route(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Mascota no encontrada"}), 404
    if pet.owner_id != int(user_id):
        return jsonify({"message": "No autorizado"}), 403
    return jsonify(pet.serialize()), 200


@api.route('/pet/<int:pet_id>', methods=['PUT'])
@jwt_required()
def update_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Mascota no encontrada"}), 404
    if pet.owner_id != int(user_id):
        return jsonify({"message": "No autorizado"}), 403

    data = request.get_json()
    pet.name = data.get("name", pet.name)
    pet.species = data.get("species", pet.species)
    pet.breed = data.get("breed", pet.breed)
    pet.age = data.get("age", pet.age)
    pet.wheight = data.get("wheight", pet.wheight)

    try:
        db.session.commit()
        return jsonify({"message": "Mascota actualizada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/pet/<int:pet_id>', methods=['DELETE'])
@jwt_required()
def delete_pet(pet_id):
    user_id = int(get_jwt_identity())
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Mascota no encontrada"}), 404
    if pet.owner_id != user_id:
        return jsonify({"message": "No autorizado"}), 403

    try:
        db.session.delete(pet)
        db.session.commit()
        return jsonify({"message": "Mascota eliminada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/pets', methods=['GET'])
@jwt_required()
def get_pets():
    user_id = get_jwt_identity()
    pets = db.session.execute(select(Pet).where(Pet.owner_id == user_id)).scalars().all()
    return jsonify([pet.serialize() for pet in pets]), 200


@api.route('/note', methods=['POST'])
@jwt_required()
def add_note():
    data = request.get_json()
    event_name = data.get('event_name')
    event_date = data.get('event_date')
    place = data.get('place')
    note = data.get('note')
    pet_id = data.get('pet_id')

    if not event_name or not pet_id:
        return jsonify({"message": "Faltan datos obligatorios"}), 400

    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Mascota no encontrada"}), 400

    try:
        if event_date:
            try:
                event_date = datetime.strptime(event_date, "%d/%m/%Y")
            except ValueError:
                event_date = datetime.fromisoformat(event_date)
        else:
            event_date = datetime.utcnow()

        new_note = ClinHistory(event_name=event_name, event_date=event_date,
                               place=place, note=note, pet_id=pet_id)
        db.session.add(new_note)
        db.session.commit()
        return jsonify({"message": "Nota añadida"}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 500

@api.route('/pets/<int:pet_id>/clin-history', methods=['GET'])
@jwt_required()
def get_clin_history_by_pet(pet_id):
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Mascota no encontrada"}), 404

    records = db.session.execute(
        select(ClinHistory).where(ClinHistory.pet_id == pet_id)
    ).scalars().all()

    return jsonify([record.serialize() for record in records]), 200


@api.route('/clin-history/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_clin_history(note_id):
    note = ClinHistory.query.get(note_id)
    if not note:
        return jsonify({"error": "Registro clínico no encontrado"}), 404

    try:
        db.session.delete(note)
        db.session.commit()
        return jsonify({"message": "Registro clínico eliminado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar el registro"}), 500


@api.route('/note/<int:id>', methods=['GET'])
@jwt_required()
def get_note(id):
    note = ClinHistory.query.get(id)
    if not note:
        return jsonify({"message": "Nota no encontrada"}), 404

    return jsonify({
        "id": note.id,
        "event_name": note.event_name,
        "event_date": note.event_date,
        "place": note.place,
        "note": note.note,
        "pet_id": note.pet_id,
        "pet_name": note.pet.name
    })


@api.route('/note/<int:id>', methods=['PUT'])
@jwt_required()
def update_note(id):
    note = ClinHistory.query.get(id)
    if not note:
        return jsonify({"message": "Nota no encontrada"}), 404

    data = request.get_json()
    note.event_name = data.get('event_name', note.event_name)
    note.event_date = data.get('event_date', note.event_date)
    note.place = data.get('place', note.place)
    note.note = data.get('note', note.note)
    note.pet_id = data.get('pet_id', note.pet_id)

    try:
        db.session.commit()
        return jsonify({"message": "Nota actualizada"}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 500

@api.route('/ask-vet', methods=['POST'])
def ask_vet():
    data = request.get_json()
    question = data.get("question", "")

    apikey = os.getenv("Clarifai_API_KEY")

    if not isinstance(question, str):
        return jsonify({"error": f"Tipo invalido : {type(question)}"}), 400

    if not question.strip():
        return jsonify({"error": "Pregunta vacia"}), 400

    try:
        try:
            asyncio.get_running_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        prompt = (
            "Eres un veterinario experto. Tu tarea es responder con consejos fiables "
            "y claros en menos de 50 palabras.\n\n"
            f"Pregunta del usuario: \"{question}\"\n"
            "Respuesta:"
        )
        model_url = "https://clarifai.com/microsoft/text-generation/models/phi-4"

        model = Model(url=model_url, pat=apikey)
        model_prediction = model.predict_by_bytes(prompt.encode())

        reply = model_prediction.outputs[0].data.text.raw
        return jsonify({"response": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@api.route("/update-password", methods=["PUT"])
@jwt_required()
def update_password():
    try:
        user_token_email = get_jwt_identity()
        
        new_password = request.json.get("password")
        
        if not new_password:
            return jsonify({"error": "Necesita una contraseña"}), 400

        user = User.query.filter_by(email=user_token_email).first()

        if user is None:
            return jsonify({"error": "Usuario no encontrado"}), 404

        salt = b64encode(os.urandom(32)).decode("utf-8")
        hashed_password = generate_password_hash(new_password + salt)

        user.salt = salt
        user.password = hashed_password

        try:
            db.session.commit()
            return jsonify({"message": "Contraseña actualizada exitosamente"}), 200
        except Exception as error:
            db.session.rollback()
            return jsonify({"error": "Error de servidor"}), 500
    except Exception as e:
        return jsonify({"error": "Error al actualizar la contraseña"}), 500
