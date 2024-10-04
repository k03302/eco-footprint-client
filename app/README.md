## Dependency Injection

### Description

프로젝트 내의 의존성을 역전시키기 위해 `Dependency Injection`을 사용한다.  
`di.ts` 파일을 통해 의존성을 주입하여 사용한다.

### Structure

- `di.ts` 파일에는 프로젝트 내에서 사용되는 의존성을 주입하는 코드를 작성한다.
- `Interface`, `Repository`, `Utils` 의 부분에서 각 부분에 맞게끔 객체를 import한다.
- `Dependency Injection` 부분에서 실제 사용하게 될 객체를 생성하고, 이를 `Export` 부분에서 export하여 의존성을 주입한다.
