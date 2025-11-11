package com.vic.frutosolar.model;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "frutas")

public class fruta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private double precio;

    @Column(nullable = false)
    private int stock;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private String imagen;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private String origen;

    @Column(nullable = false)
    private String sostenibilidad;

    @Column(nullable = false)
    private String receta;

    
}
