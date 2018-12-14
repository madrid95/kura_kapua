var ProtoBuf = require("protobufjs"),
    ByteBuffer = ProtoBuf.ByteBuffer;
var mqtt = require('mqtt')
var faker = require('faker');

var builder = ProtoBuf.loadProtoFile("./kurapayload.proto");
var kuradatatypes = builder.build("kuradatatypes");

var KuraPayload = kuradatatypes.KuraPayload;
var KuraMetric = KuraPayload.KuraMetric;
var KuraPosition = KuraPayload.KuraPosition;
var ValueType = KuraMetric.ValueType;

for (var i = 0; i < 10; i++) {
    var mac = faker.internet.mac();
    var client = mqtt.connect('mqtt://52.91.113.121:1883', {
        'username': 'User123',
        'password': 'Kapu@12345678',
        'clientId': mac
    })

    //console.log(payload);
    //console.log(payload.encode());

    client.on('connect', function() {
        console.log("Connection to Kapua / MQTT broker successfuly established.")

        var payload = new KuraPayload({
            'metric': [

                new KuraMetric({
                    'name': 'display_name',
                    'type': ValueType.STRING,
                    'string_value': faker.commerce.productName()
                }),

                new KuraMetric({
                    'name': 'connection_ip',
                    'type': ValueType.STRING,
                    'string_value': '127.0.0.1'
                }),

                new KuraMetric({
                    'name': 'kura_version',
                    'type': ValueType.STRING,
                    'string_value': '1.4'
                }),
            ],
            'position': new KuraPosition({
                'latitude': Number(faker.address.latitude()),
                'longitude': Number(faker.address.longitude())
            })
        });

        //console.log (payload) ;

        this.publish("$EDC/Account123/" + this.options.clientId + "/MQTT/BIRTH",
            payload.encode().toBuffer());
        console.log("Birth certificate... done.");
        //client.close();
    })
}