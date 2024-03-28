package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"
    "strconv"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Set CORS headers
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

        // Pre-flight request
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    }
}
// Product represents a product with an ID, name, description, price, and category.
type Product struct {
    ID          int     `json:"id" bson:"id"`
    Name        string  `json:"name" bson:"name"`
    Description string  `json:"description" bson:"description"`
    Price       float64 `json:"price" bson:"price"`
    Category    string  `json:"category" bson:"category"`
}

var productsCollection *mongo.Collection

func init() {
    // Set up MongoDB connection
    mongoURI := os.Getenv("MONGO_URI")
    if mongoURI == "" {
        mongoURI = "mongodb://localhost:27017"
    }
    clientOptions := options.Client().ApplyURI(mongoURI)
    client, err := mongo.Connect(context.Background(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }

    // Get the products collection
    productsCollection = client.Database("shipping_handling").Collection("products")

    // Check if the collection is empty
    count, err := productsCollection.CountDocuments(context.Background(), bson.M{})
    if err != nil {
        log.Fatal(err)
    }

    if count == 0 {
        // Insert initial product data
        initialProducts := []interface{}{
            Product{ID: 1, Name: "Wireless Bluetooth Headphones", Description: "High-quality sound and comfortable fit", Price: 59.99, Category: "Electronics"},
            Product{ID: 2, Name: "Vintage Leather Backpack", Description: "Stylish and durable backpack for everyday use", Price: 89.99, Category: "Accessories"},
            Product{ID: 3, Name: "Stainless Steel Water Bottle", Description: "Eco-friendly and leak-proof water bottle", Price: 19.99, Category: "Home & Kitchen"},
            Product{ID: 4, Name: "Organic Green Tea", Description: "A refreshing and healthy organic green tea", Price: 15.99, Category: "Groceries"},
            Product{ID: 5, Name: "Smartwatch Fitness Tracker", Description: "Track your fitness and stay connected on the go", Price: 199.99, Category: "Electronics"},
            Product{ID: 6, Name: "Professional Studio Microphone", Description: "Record high-quality audio with this studio microphone", Price: 129.99, Category: "Electronics"},
            Product{ID: 7, Name: "Ergonomic Office Chair", Description: "Stay comfortable while working with this ergonomic chair", Price: 249.99, Category: "Office Supplies"},
            Product{ID: 8, Name: "LED Desk Lamp", Description: "Brighten your workspace with this energy-efficient LED lamp", Price: 39.99, Category: "Home & Kitchen"},
            Product{ID: 9, Name: "Gourmet Chocolate Box", Description: "Indulge in a variety of gourmet chocolates", Price: 29.99, Category: "Groceries"},
            Product{ID: 10, Name: "Yoga Mat with Carrying Strap", Description: "A non-slip yoga mat perfect for all types of yoga", Price: 49.99, Category: "Fitness"},
            Product{ID: 11, Name: "Insulated Camping Tent", Description: "A durable and insulated tent for your outdoor adventures", Price: 349.99, Category: "Outdoor"},
            Product{ID: 12, Name: "Bluetooth Speaker", Description: "Portable speaker with exceptional sound quality", Price: 99.99, Category: "Electronics"},
        }
        _, err := productsCollection.InsertMany(context.Background(), initialProducts)
        if err != nil {
            log.Fatal(err)
        }
        fmt.Println("Inserted initial product data")
    }
}

// calculateShippingFee calculates the shipping and handling fee based on the category of the product and time of day.
func calculateShippingFee(category string) float64 {
    baseFee := 5.0 // Base fee for shipping
    var categoryMultiplier float64
    timeOfDaySurcharge := 0.0
    peakHoursStart := 14 // 2 PM
    peakHoursEnd := 19   // 7 PM

    // Determine the multiplier for the category
    switch category {
    case "Electronics":
        categoryMultiplier = 2.0
    case "Office Supplies":
        categoryMultiplier = 1.8
    case "Home & Kitchen":
        categoryMultiplier = 1.5
    case "Groceries":
        categoryMultiplier = 1.2
    case "Fitness", "Outdoor":
        categoryMultiplier = 1.4
    default:
        categoryMultiplier = 1.0
    }

    // Get current hour to determine if it's peak hours
    currentHour := time.Now().Hour()

    // Check if it's peak hours
    if currentHour >= peakHoursStart && currentHour <= peakHoursEnd {
        timeOfDaySurcharge = 3.0 // Add surcharge for peak hours
    }

    // Calculate the final fee
    return baseFee*categoryMultiplier + timeOfDaySurcharge
}

// handleShippingFee responds to the request with the calculated shipping fee for a product by its ID.
func handleShippingFee(w http.ResponseWriter, r *http.Request) {
    // Extract product ID from request
    productIDStr := r.URL.Query().Get("product_id")
    if productIDStr == "" {
        http.Error(w, "Product ID is required", http.StatusBadRequest)
        return
    }

    // Convert product ID to integer
    productID, err := strconv.Atoi(productIDStr)
    if err != nil {
        http.Error(w, "Invalid product ID", http.StatusBadRequest)
        return
    }

    // Find product by ID in the MongoDB collection
    var product Product
    err = productsCollection.FindOne(context.Background(), bson.M{"id": productID}).Decode(&product)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            http.Error(w, "Product not found", http.StatusNotFound)
        } else {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
        return
    }

    // Calculate shipping fee
    shippingFee := calculateShippingFee(product.Category)

    // Create response object that now includes all product details along with the shipping fee
    response := struct {
        ID          int     `json:"id"`
        Name        string  `json:"name"`
        Description string  `json:"description"`
        Price       float64 `json:"price"`
        Category    string  `json:"category"`
        ShippingFee float64 `json:"shipping_fee"`
    }{
        ID:          product.ID,
        Name:        product.Name,
        Description: product.Description,
        Price:       product.Price,
        Category:    product.Category,
        ShippingFee: shippingFee,
    }

    // Send response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

// handleShippingExplanation provides a JSON object with a sophisticated explanation of the shipping fee calculation.
func handleShippingExplanation(w http.ResponseWriter, r *http.Request) {
    explanation := map[string]string{
        "explanation": "The shipping and handling fees are computed by employing a multi-tiered analytical framework. " +
            "The base fee is dynamically adjusted in accordance with the product's categorical classification. " +
            "This foundational fee is further compounded by a temporally variable surcharge applied during periods of " +
            "high demand, denoted as peak hours, which span from 2 PM to 7 PM. This intricate calculus ensures that the " +
            "fee structure robustly reflects both the logistical complexity inherent to the product's category and the " +
            "fluctuating operational demands associated with peak transactional intervals.",
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(explanation)
}

func handleAllShippingFees(w http.ResponseWriter, r *http.Request) {
    // Find all products in the MongoDB collection
    cursor, err := productsCollection.Find(context.Background(), bson.M{})
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.Background())

    var feeDetails []struct {
        ProductID   int     `json:"product_id"`
        ShippingFee float64 `json:"shipping_fee"`
        Price       float64 `json:"price"`
        Name        string  `json:"name"`
        Description string  `json:"description"`
        Category    string  `json:"category"`
    }

    for cursor.Next(context.Background()) {
        var product Product
        err := cursor.Decode(&product)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        fee := calculateShippingFee(product.Category)
        feeDetails = append(feeDetails, struct {
            ProductID   int     `json:"product_id"`
            ShippingFee float64 `json:"shipping_fee"`
            Price       float64 `json:"price"`
            Name        string  `json:"name"`
            Description string  `json:"description"`
            Category    string  `json:"category"`
        }{
            ProductID:   product.ID,
            ShippingFee: fee,
            Price:       product.Price,
            Name:        product.Name,
            Description: product.Description,
            Category:    product.Category,
        })
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(feeDetails)
}

func main() {
    http.HandleFunc("/shipping-fee", corsMiddleware(handleShippingFee))
    http.HandleFunc("/shipping-explanation", corsMiddleware(handleShippingExplanation))
    http.HandleFunc("/all-shipping-fees", corsMiddleware(handleAllShippingFees))

    fmt.Println("Server is running on port 8080...")
    log.Fatal(http.ListenAndServe(":8080", nil))
}