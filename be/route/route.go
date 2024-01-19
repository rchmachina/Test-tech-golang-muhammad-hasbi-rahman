package route

import (
	"github.com/labstack/echo/v4"
)

func RouteInit(e *echo.Group) {
	LoginRoute(e)
	phoneRoute(e)

}
