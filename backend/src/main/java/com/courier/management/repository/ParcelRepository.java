package com.courier.management.repository;

import com.courier.management.entity.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParcelRepository extends JpaRepository<Parcel, Integer> {

    boolean existsByTrackingNumber(String trackingNumber);
}