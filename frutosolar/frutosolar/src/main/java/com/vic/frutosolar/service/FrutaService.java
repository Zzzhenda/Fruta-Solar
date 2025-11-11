package com.vic.frutosolar.service;

import com.vic.frutosolar.model.fruta;
import com.vic.frutosolar.repository.FrutaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FrutaService {

    @Autowired
    private FrutaRepository frutaRepository;

    // Método para guardar una fruta
    public fruta guardarFruta(fruta fruta) {
        return frutaRepository.save(fruta);
    }

    // Método para listar todas las frutas
    public List<fruta> listarFrutas() {
        return frutaRepository.findAll();
    }

    // Método para obtener una fruta por su ID
    public Optional<fruta> obtenerFrutaPorId(Long id) {
        return frutaRepository.findById(id);
    }

    // Método para actualizar una fruta existente
    public fruta actualizarFruta(Long id, fruta fruta) {
        fruta existente = frutaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("La fruta con id " + id + " no existe"));
        
        // Actualizar los campos de la fruta existente
        existente.setNombre(fruta.getNombre());
        existente.setPrecio(fruta.getPrecio());
        existente.setStock(fruta.getStock());
        existente.setCategoria(fruta.getCategoria());
        existente.setImagen(fruta.getImagen());
        existente.setDescripcion(fruta.getDescripcion());
        existente.setOrigen(fruta.getOrigen());
        existente.setSostenibilidad(fruta.getSostenibilidad());
        existente.setReceta(fruta.getReceta());

        return frutaRepository.save(existente);
    }

    // Método para eliminar una fruta por su ID
    public void eliminarFruta(Long id) {
        frutaRepository.deleteById(id);
    }
}
