package com.courier.management.service;

import com.courier.management.dto.DeliveryDetailsDto;
import com.courier.management.dto.AssignDeliveryRequest;
import com.courier.management.entity.*;
import com.courier.management.exception.ResourceNotFoundException;
import com.courier.management.repository.DeliveryRepository;
import com.courier.management.repository.EmployeeRepository;
import com.courier.management.repository.ParcelRepository;
import com.courier.management.repository.RouteRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final EmployeeRepository employeeRepository;
    private final ParcelRepository parcelRepository;
    private final RouteRepository routeRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public DeliveryService(
            DeliveryRepository deliveryRepository,
            EmployeeRepository employeeRepository,
            ParcelRepository parcelRepository,
            RouteRepository routeRepository) {

        this.deliveryRepository = deliveryRepository;
        this.employeeRepository = employeeRepository;
        this.parcelRepository = parcelRepository;
        this.routeRepository = routeRepository;
    }

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAllWithDetails();
    }

    public Delivery getDeliveryById(Integer id) {

        return deliveryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Delivery not found with id: " + id
                        ));
    }

    public List<DeliveryDetailsDto> getDeliveryDetails() {

        return deliveryRepository.findAllWithDetails()
                .stream()
                .map(this::convertToDetailsDto)
                .toList();
    }

    private DeliveryDetailsDto convertToDetailsDto(Delivery delivery) {

        DeliveryDetailsDto dto = new DeliveryDetailsDto();

        dto.setDeliveryId(delivery.getDeliveryId());

        dto.setEmployeeId(
                delivery.getEmployee().getEmployeeId()
        );

        dto.setEmployeeName(
                delivery.getEmployee().getName()
        );

        dto.setEmployeeEmail(
                delivery.getEmployee().getEmail()
        );

        dto.setParcelId(
                delivery.getParcel().getParcelId()
        );

        dto.setTrackingNumber(
                delivery.getParcel().getTrackingNumber()
        );

        dto.setSenderName(
                delivery.getParcel().getSenderName()
        );

        dto.setReceiverName(
                delivery.getParcel().getReceiverName()
        );

        dto.setReceiverAddress(
                delivery.getParcel().getReceiverAddress()
        );

        dto.setRouteId(
                delivery.getRoute().getRouteId()
        );

        dto.setRouteName(
                delivery.getRoute().getRouteName()
        );

        dto.setSource(
                delivery.getRoute().getSource()
        );

        dto.setDestination(
                delivery.getRoute().getDestination()
        );

        dto.setAssignedDate(
                delivery.getAssignedDate()
        );

        dto.setDeliveryDate(
                delivery.getDeliveryDate()
        );

        dto.setDeliveryStatus(
                delivery.getDeliveryStatus()
        );

        return dto;
    }

    @Transactional
    public void assignDelivery(AssignDeliveryRequest request) {

        Employee employee = employeeRepository
                .findById(request.getEmployeeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: "
                                        + request.getEmployeeId()
                        ));

        Parcel parcel = parcelRepository
                .findById(request.getParcelId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Parcel not found with id: "
                                        + request.getParcelId()
                        ));

        Route route = routeRepository
                .findById(request.getRouteId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Route not found with id: "
                                        + request.getRouteId()
                        ));

        entityManager
                .createStoredProcedureQuery("assign_delivery")
                .registerStoredProcedureParameter(
                        "p_employee_id",
                        Integer.class,
                        jakarta.persistence.ParameterMode.IN
                )
                .registerStoredProcedureParameter(
                        "p_parcel_id",
                        Integer.class,
                        jakarta.persistence.ParameterMode.IN
                )
                .registerStoredProcedureParameter(
                        "p_route_id",
                        Integer.class,
                        jakarta.persistence.ParameterMode.IN
                )
                .setParameter("p_employee_id", employee.getEmployeeId())
                .setParameter("p_parcel_id", parcel.getParcelId())
                .setParameter("p_route_id", route.getRouteId())
                .execute();
    }

    @Transactional
    public Delivery updateDeliveryStatus(
            Integer id,
            DeliveryStatus status) {

        Delivery delivery = getDeliveryById(id);

        delivery.setDeliveryStatus(status);

        if (status == DeliveryStatus.DELIVERED) {
            delivery.setDeliveryDate(LocalDateTime.now());
        }

        return deliveryRepository.save(delivery);
    }

    public void deleteDelivery(Integer id) {

        Delivery delivery = getDeliveryById(id);

        deliveryRepository.delete(delivery);
    }

    public int getEmployeeDeliveryCount(Integer employeeId) {

        return ((Number) entityManager
                .createNativeQuery(
                        "SELECT count_employee_deliveries(:employeeId)"
                )
                .setParameter("employeeId", employeeId)
                .getSingleResult())
                .intValue();
    }
}