from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import os
import time

app = Flask(__name__)
CORS(app)

# PostgreSQL connection details
pg_host = os.environ['POSTGRES_HOST']
pg_port = os.environ['POSTGRES_PORT']
pg_database = os.environ['POSTGRES_DB']
pg_user = os.environ['POSTGRES_USER']
pg_password = os.environ['POSTGRES_PASSWORD']

# Connect to the PostgreSQL database with retry
max_retries = 5
retry_delay = 5  # seconds

for retry in range(max_retries):
    try:
        conn = psycopg2.connect(
            host=pg_host,
            port=pg_port,
            database=pg_database,
            user=pg_user,
            password=pg_password
        )
        break
    except psycopg2.OperationalError as e:
        if retry < max_retries - 1:
            print(f"Connection attempt {retry + 1} failed. Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
        else:
            print("Max retries reached. Unable to connect to the database.")
            raise e

# Create the inventory table if it doesn't exist
with conn.cursor() as cur:
    cur.execute('''
        CREATE TABLE IF NOT EXISTS inventory (
            product_id INT PRIMARY KEY,
            quantity INT NOT NULL
        )
    ''')
    conn.commit()

# Insert initial inventory data if the table is empty
def insert_initial_data():
    with conn.cursor() as cur:
        cur.execute('SELECT COUNT(*) FROM inventory')
        count = cur.fetchone()[0]
        if count == 0:
            initial_data = [ (1, 100), (2, 50), (3, 75), (4, 120), (5, 30), (6, 60), (7, 40), (8, 90), (9, 80), (10, 70), (11, 20), (12, 55)]
            cur.executemany('INSERT INTO inventory (product_id, quantity) VALUES (%s, %s)', initial_data)
            conn.commit()
            print('Initial inventory data inserted')

# Call the function to insert initial data
insert_initial_data()

# Get inventory for all products
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    with conn.cursor() as cur:
        cur.execute('SELECT * FROM inventory')
        rows = cur.fetchall()
        inventory = [{'id': row[0], 'quantity': row[1]} for row in rows]
        return jsonify(inventory)

# Get inventory for a single product by ID
@app.route('/api/inventory/<int:product_id>', methods=['GET'])
def get_product_inventory(product_id):
    with conn.cursor() as cur:
        cur.execute('SELECT * FROM inventory WHERE product_id = %s', (product_id,))
        row = cur.fetchone()
        if row:
            product = {'id': row[0], 'quantity': row[1]}
            return jsonify(product)
        else:
            return jsonify({'error': 'Product not found'}), 404

# Reduce the quantity of a product by 1
@app.route('/api/order/<int:product_id>', methods=['POST'])
def order_product(product_id):
    with conn.cursor() as cur:
        cur.execute('SELECT * FROM inventory WHERE product_id = %s', (product_id,))
        row = cur.fetchone()
        if row:
            quantity = row[1]
            if quantity > 0:
                cur.execute('UPDATE inventory SET quantity = quantity - 1 WHERE product_id = %s', (product_id,))
                conn.commit()
                updated_quantity = quantity - 1
                return jsonify({'id': product_id, 'quantity': updated_quantity})
            else:
                return jsonify({'error': 'Product is out of stock'}), 400
        else:
            return jsonify({'error': 'Product not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002)