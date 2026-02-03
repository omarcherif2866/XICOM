package com.example.xicombackend.repository;
import com.example.xicombackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer > {

    Optional<User> findByNameOrEmail(String name, String email);
    Boolean existsByName(String name);
    Boolean existsByEmail(String email);

    User findByEmail(String email);
}
