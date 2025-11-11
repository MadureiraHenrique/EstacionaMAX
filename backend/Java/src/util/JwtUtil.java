package util;

import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;

public class JwtUtil {
    public static final String SECRET = "UmachavemuitolongaparausarcomochaveparacriarachavesecretaJWT129031902748913748913779401093890128390128904128947238491270";

    public static final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));


}
