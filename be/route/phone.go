package route

import (
	handlers "be/handler"
	repositories "be/repository"
	"be/utils/auth"
	db "be/utils/database"

	"github.com/labstack/echo/v4"
)

func phoneRoute(e *echo.Group) {

	phonebookRepository := repositories.RepositoryPhonebook(db.DB)
	h := handlers.PhonebookHandler(phonebookRepository)

	e.GET("/getdata", auth.Oauth2Middleware(h.GetPhonebook))
	e.POST("/deletedata", auth.Oauth2Middleware(h.DeleteData))
	//e.PUT("/update-data",auth.Oauth2Middleware(h.UpdateData) )
	e.PUT("/update-data", h.UpdateData)
	e.POST("/postHP", auth.Oauth2Middleware(h.PostPhonebook))
	e.POST("/postHPBulk", auth.Oauth2Middleware(h.BulkData))

}
