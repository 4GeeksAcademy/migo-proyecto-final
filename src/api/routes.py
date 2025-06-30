"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, RoleEnum, Pet, ClinHistory
from api.utils import generate_sitemap, APIException, send_email, check_password
from flask_cors import CORS
from api.utils import set_password, check_password
from base64 import b64encode
import os
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime
from flask import request
from api.cloudinary_config import cloudinary
import cloudinary.uploader
from flask_jwt_extended import jwt_required, get_jwt_identity


api = Blueprint('api', __name__)

expires_in_minutes = 10
expires_delta = timedelta(minutes=expires_in_minutes)

# Allow CORS requests to this API
CORS(api)


@api.route('/healt-check', methods=['GET'])
def handle_hello():
    return jsonify("ok"), 200


@api.route('/register', methods=['POST'])
def add_user():
    data = request.json
    email = data.get('email', None)
    name = data.get('name', None)
    lastname = data.get('lastname', None)
    password = data.get('password', None)
    salt = b64encode(os.urandom(32)).decode('utf-8')
    role = RoleEnum.general

    if email == 'valen2004vega@gmail.com':
        role = RoleEnum.admin

    if email is None or name is None or lastname is None or password is None:
        return jsonify('You need an email, a name, a lastname and a password'), 400

    stmt = select(User).where(User.email == email)
    existing_email = db.session.execute(stmt).scalar_one_or_none()

    if existing_email:
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

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user_id": user.id}), 200


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
        identity=user.id, expires_delta=expires_delta)

    message = f"""
        <p>Hola {user.name},</p>

        <p>Con este link, podrás <a href="{os.getenv("FRONTEND_URL")}/password-update?token={access_token}">recuperar tu contraseña</a>.</p>

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
    image = data.get('image')

    if not name:
        return jsonify({"message": "Necesita al menos el nombre de la mascota"}), 400

    existing_pet = db.session.execute(
        select(Pet).where(Pet.name == name, Pet.owner_id == owner_id)
    ).scalar_one_or_none()

    if existing_pet:
        return jsonify({"message": "Ya registraste una mascota con este nombre"}), 409

    try:
        pet = Pet(
            name=name,
            species=species,
            breed=breed,
            age=int(age) if age else None,
            wheight=float(wheight) if wheight else None,
            owner_id=owner_id,
            image=image  
)
        

        db.session.add(pet)
        db.session.commit()

        return jsonify({"message": "Mascota añadida"}), 201

    except Exception as error:
        db.session.rollback()
        print("Error al registrar mascota:", error)
        return jsonify({"error": str(error)}), 500


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

    if not event_name:
        return jsonify({"message": "Necesita al menos el nombre del evento"}), 400
    
    if not event_date:
        event_date = datetime.now()

    try:
        new_note = ClinHistory(
            event_name = event_name,   
            event_date = event_date,
            place = place,
            note = note,
            pet_id = pet_id
        )

        db.session.add(new_note)
        db.session.commit()

        return jsonify({"message" : "Nota añadida"}), 201

    except Exception as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 500    

@api.route('/notes', methods=['GET'])
@jwt_required()
def get_notes():
    user_id = get_jwt_identity()
    
    notes = db.session.execute(select(ClinHistory).where(ClinHistory.pet_id == pet.id)).scalars().all()
    return jsonify([note.serialize() for note in notes]), 200


@api.route('/upload', methods=['POST'])
@jwt_required()
def upload_image():
    if 'image' not in request.files:
        return jsonify({"msg": "No se proporcionó ninguna imagen"}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({"msg": "Nombre de archivo vacío"}), 400

    try:
        result = cloudinary.uploader.upload(image)
        return jsonify({
            "image_url": result.get("secure_url"),
            "public_id": result.get("public_id")
        }), 200
    except Exception as e:
        return jsonify({"error": f"Error al subir imagen: {str(e)}"}), 500
