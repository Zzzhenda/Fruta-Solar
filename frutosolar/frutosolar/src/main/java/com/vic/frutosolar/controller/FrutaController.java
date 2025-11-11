package com.vic.frutosolar.controller;

import com.vic.frutosolar.model.fruta;
import com.vic.frutosolar.service.FrutaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/frutas")
public class FrutaController {

    @Autowired
    private FrutaService frutaService;

    // Crear una nueva fruta
    @PostMapping
    public fruta crearFruta(@RequestBody fruta fruta) {
        return frutaService.guardarFruta(fruta);
    }

    // Obtener todas las frutas
    @GetMapping
    public List<fruta> obtenerTodas() {
        return frutaService.listarFrutas();
    }

    // Obtener una fruta por su ID
    @GetMapping("/{id}")
    public ResponseEntity<fruta> obtenerPorId(@PathVariable Long id) {
        return frutaService.obtenerFrutaPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar una fruta existente
    @PutMapping("/{id}")
    public ResponseEntity<fruta> actualizar(@PathVariable Long id, @RequestBody fruta fruta) {
        try {
            fruta actualizada = frutaService.actualizarFruta(id, fruta);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar una fruta por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        frutaService.eliminarFruta(id);
        return ResponseEntity.noContent().build();
    }
}
