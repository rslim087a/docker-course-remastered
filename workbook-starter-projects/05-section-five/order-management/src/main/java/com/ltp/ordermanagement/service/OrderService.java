package com.ltp.ordermanagement.service;

import com.ltp.ordermanagement.model.CartItem;
import com.ltp.ordermanagement.model.InventoryResponse;
import com.ltp.ordermanagement.model.Order;
import com.ltp.ordermanagement.model.Product;
import com.ltp.ordermanagement.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    private final RestTemplate restTemplate;
    private final OrderRepository orderRepository;
    private final MongoTemplate mongoTemplate;

    @Value("${PRODUCT_INVENTORY_API_HOST}")
    private String productInventoryApiHost;

    @Value("${PRODUCT_CATALOG_API_HOST}")
    private String productCatalogApiHost;

    @Value("${SHIPPING_HANDLING_API_HOST}")
    private String shippingHandlingApiHost;

    @Autowired
    public OrderService(RestTemplate restTemplate, OrderRepository orderRepository, MongoTemplate mongoTemplate) {
        this.restTemplate = restTemplate;
        this.orderRepository = orderRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public String addToCart(Long userId, Product product) {
        // Check if the order already exists for the user
        Query query = new Query(Criteria.where("userId").is(userId));
        Order order = mongoTemplate.findOne(query, Order.class);
        if (order == null) {
            // Create a new order if it doesn't exist
            order = new Order();
            order.setUserId(userId);
            order.setItems(new ArrayList<>());
            order.setStatus("PENDING");
        }

        // Check if the product already exists in the order
        List<CartItem> items = order.getItems();
        if (items.stream().anyMatch(item -> item.getProductId().equals(product.getId()))) {
            return "Product already exists in the cart";
        }

        // Check the inventory of the product
        InventoryResponse inventoryResponse = restTemplate.getForObject(productInventoryApiHost + ":3002/api/inventory/" + product.getId(), InventoryResponse.class);
        if (inventoryResponse == null || inventoryResponse.getQuantity() <= 0) {
            return "Product is out of stock";
        }

        Product productDetails = restTemplate.getForObject(productCatalogApiHost + ":3001/api/products/" + product.getId(), Product.class);
        // Add the product to the order
        CartItem cartItem = new CartItem(
            productDetails.getId(),
            1, // assuming quantity 1 for simplicity
            productDetails.getName(),
            productDetails.getDescription(),
            productDetails.getPrice(),
            productDetails.getCategory()
        );
        items.add(cartItem);
        order.setItems(items);

        // Save the updated order
        orderRepository.save(order);

        return "Product added to the cart";
    }

    public double getCartSubtotal(Long userId) {
        Query query = new Query(Criteria.where("userId").is(userId));
        Order order = mongoTemplate.findOne(query, Order.class);
        if (order == null) {
            return 0.0;
        }
        List<CartItem> items = order.getItems();
        return items.stream()
                .mapToDouble(item -> {
                    Product product = restTemplate.getForObject(productCatalogApiHost + ":3001/api/products/" + item.getProductId(), Product.class);
                    return product.getPrice() * item.getQuantity();
                })
                .sum();
    }

    public double getCartShippingTotal(Long userId) {
        Query query = new Query(Criteria.where("userId").is(userId));
        Order order = mongoTemplate.findOne(query, Order.class);
        if (order == null) {
            return 0.0;
        }
        List<CartItem> items = order.getItems();
        return items.stream()
                .mapToDouble(item -> {
                    Product product = restTemplate.getForObject(shippingHandlingApiHost + ":8080/shipping-fee?product_id=" + item.getProductId(), Product.class);
                    if (product != null) {
                        return product.getShippingFee();
                    } else {
                        return 0.0;
                    }
                })
                .sum();
    }

    public double getCartTotal(Long userId) {
        double subtotal = getCartSubtotal(userId);
        double shippingTotal = getCartShippingTotal(userId);
        return subtotal + shippingTotal;
    }

    public String purchaseCart(Long userId) {
        Query query = new Query(Criteria.where("userId").is(userId));
        Order order = mongoTemplate.findOne(query, Order.class);
        if (order == null) {
            return "No items in the cart";
        }

        // Update the inventory for each product in the order
        List<CartItem> items = order.getItems();
        for (CartItem item : items) {
            restTemplate.postForObject(productInventoryApiHost + ":3002/api/order/" + item.getProductId(), item.getQuantity(), Void.class);
        }

        // Update the order status to "COMPLETED"
        order.setStatus("COMPLETED");
        orderRepository.save(order);

        // Clear the cart items
        order.setItems(new ArrayList<>());
        orderRepository.save(order);

        return "Purchase completed";
    }
    
    public List<CartItem> getUserCart(Long userId) {
        Query query = new Query(Criteria.where("userId").is(userId));
        Order order = mongoTemplate.findOne(query, Order.class);
        if (order != null) {
            return order.getItems();
        }
        return null;
    }
}