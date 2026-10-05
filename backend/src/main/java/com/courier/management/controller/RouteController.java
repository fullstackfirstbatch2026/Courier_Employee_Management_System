package com.courier.management.controller;

import com.courier.management.entity.Route;
import com.courier.management.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(
                routeService.getAllRoutes()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> getRoute(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                routeService.getRouteById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Route> createRoute(
            @Valid @RequestBody Route route) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(routeService.createRoute(route));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Route> updateRoute(
            @PathVariable Integer id,
            @Valid @RequestBody Route route) {

        return ResponseEntity.ok(
                routeService.updateRoute(id, route)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(
            @PathVariable Integer id) {

        routeService.deleteRoute(id);

        return ResponseEntity.noContent().build();
    }
}