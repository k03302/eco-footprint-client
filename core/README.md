## Core

### Description

`Core` Directory에는 프로젝트에서 사용되는 데이터와 이를 다루는 클래스의 추상화를 정의한다

### Structure

- `model.ts` : 프로젝트에서 사용되는 데이터(예: 사용자 정보 데이터)의 DTO 형태로 추상화 된 `Object`를 정의한다.  
  각 데이터는 `type` 형태로 정의하고, 각 데이터를 잘 표현할 수 있는 단어를 사용하여 `CamelCase`로 정의한다.
  (예: `User`, `UserProfile`, `UserSetting` 등)
- `repository.ts` : `model.ts`에 정의된 데이터를 다루는 클래스를 추상화하는 `interface`를 정의한다.  
   각 데이터를 다루는 인터페이스는 `Repository`라는 접미사를 붙여 정의한다.  
   (예: `UserRepository`, `UserProfileRepository`, `UserSettingRepository` 등)  
   각 인터페이스는 해당 데이터를 다루는 메소드를 정의하며, 각 메소드는 해당 데이터를 다루는데 필요한 파라미터를 받아서 처리한다.

### Example

```typescript
// model.ts
export type User {
  id: string;
  age: number;
  name: string;
  email: string;
}

// repository.ts
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByName(name: string): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```
