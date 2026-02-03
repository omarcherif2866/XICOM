package com.example.xicombackend.service;
import com.example.xicombackend.entity.User;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface UserService {
    User adduser(User users);
    void deleteUserEntityById(Integer id);
    User getUserById(Integer id);

    public List<User> getAllUsers();

    boolean existByEmail(String email);


    User updateUser(Integer id, User user);

    User registerNewUser(User newUser);

    void blockUser(Integer userId);
    void unblockUser(Integer userId);
    void changePassword(Integer id, String oldPassword, String newPassword);
    Map<String, String> sendVerificationCode(String email);
    void verifyCode(String userId, String code);
    void resetPassword(String userId, String newPassword);

}



