package Controller;

public class LoginResponse {
    private String token;
    private UsuarioInfo usuarioInfo;

    public LoginResponse(String token, UsuarioInfo usuarioInfo) {
        this.token = token;
        this.usuarioInfo = usuarioInfo;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UsuarioInfo getUsuarioInfo() {
        return usuarioInfo;
    }

    public void setUsuarioInfo(UsuarioInfo usuarioInfo) {
        this.usuarioInfo = usuarioInfo;
    }
}
