package com.ltp.ordermanagement;

import com.ltp.ordermanagement.model.Product;
import com.ltp.ordermanagement.service.OrderService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @CrossOrigin(origins = "*") // Allow any origin
    @PostMapping("/{userId}/cart")
    public String addToCart(@PathVariable Long userId, @RequestBody Product product) {
        return orderService.addToCart(userId, product);
    }

    @CrossOrigin(origins = "*") // Allow any origin
    @GetMapping("/{userId}/cart/subtotal")
    public double getCartSubtotal(@PathVariable Long userId) {
        return orderService.getCartSubtotal(userId);
    }

    @CrossOrigin(origins = "*") // Allow any origin
    @GetMapping("/{userId}/cart/shipping")
    public double getCartShippingTotal(@PathVariable Long userId) {
        return orderService.getCartShippingTotal(userId);
    }

    @CrossOrigin(origins = "*") // Allow any origin
    @GetMapping("/{userId}/cart/total")
    public double getCartTotal(@PathVariable Long userId) {
        return orderService.getCartTotal(userId);
    }

    @CrossOrigin(origins = "*") // Allow any origin
    @PostMapping("/{userId}/purchase")
    public String purchaseCart(@PathVariable Long userId) {
        return orderService.purchaseCart(userId);
    }

    @CrossOrigin(origins = "*") // Allow any origin
    @GetMapping("/{userId}/cart")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long userId) {
        List<CartItem> cartItems = orderService.getUserCart(userId);
        if (cartItems != null) {
            return new ResponseEntity<>(cartItems, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}