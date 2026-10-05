package com.courier.management.controller;

import com.courier.management.entity.Parcel;
import com.courier.management.service.ParcelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parcels")
@CrossOrigin(origins = "*")
public class ParcelController {

    private final ParcelService parcelService;

    public ParcelController(ParcelService parcelService) {
        this.parcelService = parcelService;
    }

    @GetMapping
    public ResponseEntity<List<Parcel>> getAllParcels() {
        return ResponseEntity.ok(
                parcelService.getAllParcels()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parcel> getParcel(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                parcelService.getParcelById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Parcel> createParcel(
            @Valid @RequestBody Parcel parcel) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(parcelService.createParcel(parcel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Parcel> updateParcel(
            @PathVariable Integer id,
            @Valid @RequestBody Parcel parcel) {

        return ResponseEntity.ok(
                parcelService.updateParcel(id, parcel)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParcel(
            @PathVariable Integer id) {

        parcelService.deleteParcel(id);

        return ResponseEntity.noContent().build();
    }
}