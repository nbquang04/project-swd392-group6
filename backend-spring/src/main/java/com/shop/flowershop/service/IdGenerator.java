
package com.shop.flowershop.service;

import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

public class IdGenerator {
    public static String timeId(String prefix) {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        int rnd = ThreadLocalRandom.current().nextInt(100, 999);
        return prefix + "-" + ts + "-" + rnd;
    }
}
