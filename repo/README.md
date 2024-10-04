## Repo

### Description

`Repo` Directory에는 프로젝트에서 사용되는 데이터를 저장하고 이를 다루는 클래스를 정의한다.

### Structure

- `Repo` Directory에는 `core/repository.ts`에 정의된 `Repository` 인터페이스를 구현하는 클래스를 정의한다.  
  각 클래스는 하나의 파일로 정의하며, 파일명은 `Repository` 인터페이스의 이름을 `snake-case`로 변환하고, 마지막엔 데이터의 출처를 나타내는 접미사를 붙여 정의한다.  
  (예: `UserRepository` -> `user-backend.ts`, `UserProfileRepository` -> `user-profile-backend.ts` 등)  
  클래스 명은 파일명을 `CamelCase`로 변환하고 마지막에 'repo'를 붙여 정의한다.  
   (예: `user-backend.ts` -> `UserBackendRepo`, `user-profile-backend.ts` -> `UserProfileBackendRepo` 등)

### Example

```typescript
// user-repo-backend.ts
import { UserRepository } from "../core/repository";
import { User } from "../core/model";

export class UserBackendRepo implements UserRepository {
  async findById(id: string): Promise<User | null> {
    // Implementation
  }

  async findByName(name: string): Promise<User[]> {
    // Implementation
  }

  async findByEmail(email: string): Promise<User | null> {
    // Implementation
  }

  async save(user: User): Promise<void> {
    // Implementation
  }

  async delete(id: string): Promise<void> {
    // Implementation
  }
}
```
