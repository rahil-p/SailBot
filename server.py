from flask import Flask, json, jsonify, request
app = Flask(__name__)

app.debug = True

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return app.send_static_file(path)

@app.route('/upload', methods=['POST'])
def upload():
    boatData = json.loads(request.args.get('data'))
    return jsonify(data=boatData)



if __name__ == '__main__':
    app.run(debug=True)
