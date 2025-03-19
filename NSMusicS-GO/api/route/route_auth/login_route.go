package route_auth

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_auth"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewLoginRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	// 依赖注入，注册工厂模式，创建UserRepository实例
	// 将db和domain_system.CollectionUser注入到 UserRepository中，以便在仓库中执行数据库操作
	ur := repository_auth.NewUserRepository(db, domain_auth.CollectionUser)
	// 初始化其依赖项，创建LoginController实例（登录控制器）。
	lc := &controller_auth.LoginController{
		// 创建 LoginUsecase 实例，并设置用例操作的超时限制timeout
		LoginUsecase: usecase_auth.NewLoginUsecase(ur, timeout),
		//应用程序的配置信息（如 JWT 密钥、日志级别等）
		Env: env,
	}
	group.POST("/login", lc.Login)
}
