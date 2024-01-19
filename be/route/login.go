package route


import (

	handlers "be/handler"
	"github.com/labstack/echo/v4"
)

func LoginRoute(e *echo.Group) {

	e.GET("/login",  handlers.GoogleLogin)
	e.GET("/loginCb",  handlers.GoogleCallback)
	
}
