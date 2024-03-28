package com.ltp.ordermanagement;

public class CartItem {
    private Long productId;
    private int quantity;
    private String name;
    private String description;
    private double price;
    private String category;

    // Constructor
    public CartItem(Long productId, int quantity, String name, String description, double price, String category) {
        this.productId = productId;
        this.quantity = quantity;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    
    // Standard getters and setters for all fields
}
