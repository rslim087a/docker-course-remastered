package com.ltp.ordermanagement.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Product {
    private Long id;
    private String name;
    private String description;
    private double price;
    private String category;
    
    @JsonProperty("shipping_fee") // This line maps the JSON field "shipping_fee" to this property
    private double shippingFee;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public double getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(double shippingFee) {
        this.shippingFee = shippingFee;
    }
    @Override
    public String toString() {
        // TODO Auto-generated method stub
        return this.getCategory() + " " + this.getDescription() + " " + this.getName() + " " + this.getPrice() + " " + this.getShippingFee();
    }

}