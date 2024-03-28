package com.ltp.ordermanagement.service;

import com.ltp.ordermanagement.CartItem;
import com.ltp.ordermanagement.model.InventoryResponse;
import com.ltp.ordermanagement.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final RestTemplate restTemplate;
    private final Map<Long, List<CartItem>> userCarts = new HashMap<>();

    @Value("${PRODUCT_INVENTORY_API_HOST}")
    private String productInventoryApiHost;

    @Value("${PRODUCT_CATALOG_API_HOST}")
    private String productCatalogApiHost;

    @Value("${SHIPPING_HANDLING_API_HOST}")
    private String shippingHandlingApiHost;

    @Autowired
    public OrderService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String addToCart(Long userId, Product product) {
        // Check if the product already exists in the user's cart
        List<CartItem> cart = getUserCart(userId);
        if (cart.stream().anyMatch(item -> item.getProductId().equals(product.getId()))) {
            return "Product already exists in the cart";
        }
    
        // Check the inventory of the product

        System.out.println(productInventoryApiHost + ":3002/api/inventory/" + product.getId());
        InventoryResponse inventoryResponse = restTemplate.getForObject(productInventoryApiHost + ":3002/api/inventory/" + product.getId(), InventoryResponse.class);
        if (inventoryResponse == null || inventoryResponse.getQuantity() <= 0) {
            return "Product is out of stock";
        }
        System.out.println(productCatalogApiHost + ":3001/api/products/" + product.getId());
        Product productDetails = restTemplate.getForObject(productCatalogApiHost + ":3001/api/products/" + product.getId(), Product.class);
        // Add the product to the user's cart
        CartItem cartItem = new CartItem(
            productDetails.getId(),
            1, // assuming quantity 1 for simplicity
            productDetails.getName(),
            productDetails.getDescription(),
            productDetails.getPrice(),
            productDetails.getCategory()
        );
        cart.add(cartItem);
        saveUserCart(userId, cart);
        printCartItems(userId);

        return "Product added to the cart";
    }

    public double getCartSubtotal(Long userId) {
        List<CartItem> cart = getUserCart(userId);
        return cart.stream()
                .mapToDouble(item -> {
                    Product product = restTemplate.getForObject(productCatalogApiHost + ":3001/api/products/" + item.getProductId(), Product.class);
                    return product.getPrice() * item.getQuantity();
                })
                .sum();
    }

    public double getCartShippingTotal(Long userId) {
        List<CartItem> cart = getUserCart(userId);
        System.out.println(userId);
        double sum = cart.stream()
                .mapToDouble(item -> {
                    // Assuming the endpoint URL is correct and returns data as expected
                    Product product = restTemplate.getForObject(shippingHandlingApiHost + ":8080/shipping-fee?product_id=" + item.getProductId(), Product.class);
                    System.out.println(product);
                    if (product != null) {
                        return product.getShippingFee();
                    } else {
                        // Handle the case where the shipping fee might not be available
                        return 0;
                    }
                })
                .sum();

        System.out.println(sum);
        return sum;
    }
    
    public double getCartTotal(Long userId) {
        double subtotal = getCartSubtotal(userId);
        double shippingTotal = getCartShippingTotal(userId);
        return subtotal + shippingTotal;
    }

    private void printCartItems(Long userId) {
        List<CartItem> cart = getUserCart(userId);
        System.out.println("Items in user " + userId + "'s cart:");
        for (CartItem item : cart) {
            Product product = restTemplate.getForObject(
                productCatalogApiHost + ":3001/api/products/" + item.getProductId(), 
                Product.class
            );
            System.out.println("Product ID: " + item.getProductId() + 
                               ", Quantity: " + item.getQuantity() +
                               ", Name: " + product.getName() + 
                               ", Price: " + product.getPrice());
        }
    
    }
    
    public String purchaseCart(Long userId) {
        List<CartItem> cart = getUserCart(userId);

        // Update the inventory for each product in the cart
        for (CartItem item : cart) {
            restTemplate.postForObject(productInventoryApiHost + ":3002/api/order/" + item.getProductId(), item.getQuantity(), Void.class);
        }

        // Clear the user's cart after purchase
        saveUserCart(userId, new ArrayList<>());

        return "Purchase completed";
    }

    // Helper method to get the user's cart from the in-memory cache
    public List<CartItem> getUserCart(Long userId) {
        return userCarts.getOrDefault(userId, new ArrayList<>());
    }

    // Helper method to save the user's cart to the in-memory cache
    private void saveUserCart(Long userId, List<CartItem> cart) {
        userCarts.put(userId, cart);
    }
}