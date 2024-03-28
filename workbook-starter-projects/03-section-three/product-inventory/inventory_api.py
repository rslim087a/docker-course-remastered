from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory storage for inventory
inventory = [
    {'id': 1, 'quantity': 100},
    {'id': 2, 'quantity': 50},
    {'id': 3, 'quantity': 75},
    {'id': 4, 'quantity': 120},
    {'id': 5, 'quantity': 30},
    {'id': 6, 'quantity': 60},
    {'id': 7, 'quantity': 40},
    {'id': 8, 'quantity': 90},
    {'id': 9, 'quantity': 80},
    {'id': 10, 'quantity': 70},
    {'id': 11, 'quantity': 20},
    {'id': 12, 'quantity': 55}
]

# Get inventory for all products
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    return jsonify(inventory)

# Get inventory for a single product by ID
@app.route('/api/inventory/<int:product_id>', methods=['GET'])
def get_product_inventory(product_id):
    product = next((p for p in inventory if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    else:
        return jsonify({'error': 'Product not found'}), 404

# Reduce the quantity of a product by 1
@app.route('/api/order/<int:product_id>', methods=['POST'])
def order_product(product_id):
    product = next((p for p in inventory if p['id'] == product_id), None)
    if product and product['quantity'] > 0:
        product['quantity'] -= 1
        return jsonify(product)
    elif product and product['quantity'] <= 0:
        return jsonify({'error': 'Product is out of stock'}), 400
    else:
        return jsonify({'error': 'Product not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002)