package com.courier.management.service;

import com.courier.management.entity.Parcel;
import com.courier.management.exception.ResourceNotFoundException;
import com.courier.management.repository.ParcelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParcelService {

    private final ParcelRepository parcelRepository;

    public ParcelService(ParcelRepository parcelRepository) {
        this.parcelRepository = parcelRepository;
    }

    public List<Parcel> getAllParcels() {
        return parcelRepository.findAll();
    }

    public Parcel getParcelById(Integer id) {
        return parcelRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Parcel not found with id: " + id
                        ));
    }

    public Parcel createParcel(Parcel parcel) {

        if (parcelRepository.existsByTrackingNumber(
                parcel.getTrackingNumber())) {

            throw new IllegalArgumentException(
                    "Tracking number already exists: "
                            + parcel.getTrackingNumber()
            );
        }

        return parcelRepository.save(parcel);
    }

    public Parcel updateParcel(Integer id, Parcel parcelDetails) {

        Parcel parcel = getParcelById(id);

        parcel.setTrackingNumber(parcelDetails.getTrackingNumber());
        parcel.setSenderName(parcelDetails.getSenderName());
        parcel.setReceiverName(parcelDetails.getReceiverName());
        parcel.setReceiverAddress(parcelDetails.getReceiverAddress());
        parcel.setWeight(parcelDetails.getWeight());
        parcel.setParcelStatus(parcelDetails.getParcelStatus());

        return parcelRepository.save(parcel);
    }

    public void deleteParcel(Integer id) {

        Parcel parcel = getParcelById(id);

        parcelRepository.delete(parcel);
    }
}