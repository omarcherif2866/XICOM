package com.example.xicombackend.security.jwt.usersecurity;

import com.example.xicombackend.entity.User;
import com.example.xicombackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        User user = userRepository.findByNameOrEmail(name,name).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found with name: " + name
                ));
        UserPrinciple userPrinciple= UserPrinciple.build(user);
        return userPrinciple;
    }
}
