package com.courier.management.controller;

import com.courier.management.dto.AssignDeliveryRequest;
import com.courier.management.dto.DeliveryDetailsDto;
import com.courier.management.dto.StatusUpdateRequest;
import com.courier.management.entity.Delivery;
import com.courier.management.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(
                deliveryService.getAllDeliveries()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDelivery(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                deliveryService.getDeliveryById(id)
        );
    }

    @GetMapping("/details")
    public ResponseEntity<List<DeliveryDetailsDto>>
    getDeliveryDetails() {

        return ResponseEntity.ok(
                deliveryService.getDeliveryDetails()
        );
    }

    @PostMapping("/assign")
    public ResponseEntity<String> assignDelivery(
            @Valid @RequestBody AssignDeliveryRequest request) {

        deliveryService.assignDelivery(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Delivery assigned successfully");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<String> updateDeliveryStatus(
            @PathVariable Integer id,
            @Valid @RequestBody StatusUpdateRequest request) {

        deliveryService.updateDeliveryStatus(
                id,
                request.getStatus()
        );

        return ResponseEntity.ok("Delivery status updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(
            @PathVariable Integer id) {

        deliveryService.deleteDelivery(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/employee/{employeeId}/count")
    public ResponseEntity<Integer> getEmployeeDeliveryCount(
            @PathVariable Integer employeeId) {

        return ResponseEntity.ok(
                deliveryService.getEmployeeDeliveryCount(employeeId)
        );
    }
}