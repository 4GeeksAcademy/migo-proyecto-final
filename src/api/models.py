from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Enum as SQLAEnum, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum


db = SQLAlchemy()

class RoleEnum(enum.Enum):
    general = 'general'
    admin = 'admin'
    vet = 'vet'

class User(db.Model):
    __tablename__ = 'user'


    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    lastname: Mapped[str] = mapped_column(String(80), nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    salt: Mapped[str] = mapped_column(String(80), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=True)
    avatar: Mapped[str] = mapped_column(String(180), nullable=True)
    role: Mapped[RoleEnum] = mapped_column(SQLAEnum(RoleEnum), nullable=False, default=RoleEnum.general)
    
    pets: Mapped[list["Pet"]] = relationship("Pet", back_populates="owner")

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'lastname': self.lastname,
            'role': self.role.value,
            'country': self.country,
            'city': self.city
            # do not serialize the password, its a security breach
        }

class Pet(db.Model):
    __tablename__ = 'pet'

    id: Mapped[int] = mapped_column(primary_key=True)  
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    species: Mapped[str] = mapped_column(String(80), nullable=True)   
    breed: Mapped[str] = mapped_column(String(80), nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=True)  
    wheight: Mapped[float] = mapped_column(Float(2), nullable=True) 
    owner_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False) 

    owner: Mapped["User"] = relationship("User", back_populates="pets")

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'species': self.species,
            'breed': self.breed,
            'age': self.age,
            'wheight': self.wheight,
            'owner_id': self.owner_id
        }
