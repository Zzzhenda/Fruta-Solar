package com.vic.frutosolar.repository;

import com.vic.frutosolar.model.fruta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface FrutaRepository extends JpaRepository<fruta, Long> {}

