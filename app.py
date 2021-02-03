from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource

app = Flask(__name__, static_folder='client/public')
app.config['SECRET_KEY'] = 'lkngdlfgknkrjgnekgj'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    events = db.relationship('Event', backref='owner')


class User_Schema(ma.Schema):
    class Meta:
        fields = ("id", "email")


user_schema = User_Schema()


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    category = db.Column(db.String(50))
    place = db.Column(db.String(255))
    address = db.Column(db.String(255))
    start_date = db.Column(db.String(100))
    end_date = db.Column(db.String(100))
    online = db.Column(db.String(50))
    user = db.Column(db.Integer, db.ForeignKey('user.id'))


class Event_Schema(ma.Schema):
    class Meta:
        fields = ("id", "name", "category", "place",
                  "address", "start_date", "end_date", "online")


post_schema = Event_Schema()
posts_schema = Event_Schema(many=True)


class ResourceListEvents(Resource):
    def get(self):
        email = request.args.get('email')
        user_found = User.query.filter_by(email=email).first()
        events = user_found.events

        return posts_schema.dump(events)

    def post(self):

        new_event = Event(
            name=request.json['name'],
            category=request.json['category'],
            place=request.json['place'],
            address=request.json['address'],
            start_date=request.json['start_date'],
            end_date=request.json['end_date'],
            online=request.json['online'],
            user=request.json['user']
        )
        db.session.add(new_event)
        db.session.commit()
        return post_schema.dump(new_event)


class ResourceOneEvent(Resource):
    def get(self, id_event):
        event = Event.query.get_or_404(id_event)
        return post_schema.dump(event)

    def put(self, id_event):
        print(id_event)
        Event.query.filter_by(id=id_event).update({Event.name: request.json['name'],
                                                   Event.category: request.json['category'],
                                                   Event.place: request.json['place'],
                                                   Event.address: request.json['address'],
                                                   Event.start_date: request.json['start_date'],
                                                   Event.end_date: request.json['end_date'], })

        db.session.commit()
        return jsonify({'message': 'Success'})

    def delete(self, id_event):
        event = Event.query.get_or_404(id_event)
        db.session.delete(event)
        db.session.commit()
        return '', 204


class ResourceHelloWorld(Resource):
    def get(self):

        return 'hello world'


class ResourceLogin(Resource):
    def get(self):
        email = request.args.get('email')
        user_found = User.query.filter_by(email=email).first()
        return user_schema.dump(user_found)

    def post(self):
        email = request.json['email']
        password = request.json['password']
        user_found = User.query.filter_by(email=email).first()
        if user_found and user_found.email:
            print(user_found.email)
        if user_found and user_found.password:
            print(user_found.password)
        if user_found and user_found.events:
            print(user_found.events)

        if not user_found:
            return jsonify({'error': 'Email no existe, desea crear una cuenta nueva?'})
        if user_found.password != password:
            return jsonify({'error': 'Contraseña no coincide'})
        return user_schema.dump(user_found)


class ResourceRegister(Resource):
    def get(self):
        return ''

    def post(self):
        email = request.json['email']
        password = request.json['password']

        new_user = User(
            email=email,
            password=password,
        )

        db.session.add(new_user)
        db.session.commit()
        return user_schema.dump(new_user)


api.add_resource(ResourceListEvents, '/events')
api.add_resource(ResourceOneEvent, '/events/<int:id_event>')
api.add_resource(ResourceRegister, '/register')
api.add_resource(ResourceLogin, '/login')
api.add_resource(ResourceHelloWorld, '/')

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, use_reloader=True)
