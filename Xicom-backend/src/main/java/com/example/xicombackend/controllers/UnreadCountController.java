package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.UnreadCount;
import com.example.xicombackend.service.UnreadCountService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/unread")
@RequiredArgsConstructor

public class UnreadCountController {

    private final UnreadCountService unreadCountService;


    @GetMapping("/chat/{username}")
    @ResponseBody
    public List<UnreadCount> getUnread(@PathVariable String username) {
        return unreadCountService.getAll(username);
    }

    @PostMapping("/chat/reset/{username}/{serviceId}")
    @ResponseBody
    public void resetUnread(@PathVariable String username,
                            @PathVariable Long serviceId) {
        unreadCountService.reset(username, serviceId);
    }


    @PostMapping("/chat/increment/{username}/{serviceId}")
    @ResponseBody
    public void incrementUnread(@PathVariable String username,
                                @PathVariable Long serviceId) {
        unreadCountService.increment(username, serviceId);
    }


}
