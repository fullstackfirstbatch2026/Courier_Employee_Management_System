package com.courier.management.service;

import com.courier.management.entity.Route;
import com.courier.management.exception.ResourceNotFoundException;
import com.courier.management.repository.RouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route getRouteById(Integer id) {
        return routeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Route not found with id: " + id
                        ));
    }

    public Route createRoute(Route route) {
        return routeRepository.save(route);
    }

    public Route updateRoute(Integer id, Route routeDetails) {

        Route route = getRouteById(id);

        route.setRouteName(routeDetails.getRouteName());
        route.setSource(routeDetails.getSource());
        route.setDestination(routeDetails.getDestination());
        route.setDistance(routeDetails.getDistance());
        route.setRouteStatus(routeDetails.getRouteStatus());

        return routeRepository.save(route);
    }

    public void deleteRoute(Integer id) {

        Route route = getRouteById(id);

        routeRepository.delete(route);
    }
}