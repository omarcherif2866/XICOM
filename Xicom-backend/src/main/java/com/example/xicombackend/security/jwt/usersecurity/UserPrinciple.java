package com.example.xicombackend.security.jwt.usersecurity;

import com.example.xicombackend.entity.Role;
import com.example.xicombackend.entity.User;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class UserPrinciple implements UserDetails {
    private Integer id;
    private String name;
    private String surname;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private Role role;
    public UserPrinciple(Integer id, String name, String surname,String email,
                         String password, Collection<? extends GrantedAuthority> authorities, Role role) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.role = role;
    }

    public static UserPrinciple build(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        // Ajoutez le rôle de l'utilisateur aux autorisations
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().toString()));

        return new UserPrinciple(user.getId(), user.getSurname(),user.getName(),
                user.getEmail(), user.getPassword(), authorities, user.getRole());
    }

   /* public static UserPrinciple build(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        return new UserPrinciple(user.getId(), user.getUsername(),
                user.getEmail(), user.getPassword(), authorities);
    } */

    public Integer getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return this.name;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
