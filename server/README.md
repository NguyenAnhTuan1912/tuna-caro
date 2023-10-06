# Modules Structure 001

Đây là cấu trúc module đầu tiên, các API Handlers được quản lý trong một cùng một module. Cấu trúc này áp dụng `Builder` và hơi có `Singleton` Pattern, tương lai có thể áp dụng thêm nhiều Pattern nữa.

## Note
- Phần cốt lõi của cấu trúc này là nằm ở chỗ nó sẽ tập chung tất cả lại thành một và cài đặt code. Có thể thấy rõ trong `templates`, `classes/MyServer`.
- Cấu trúc thư mục sẽ khác với cấu trúc hệ thống (Kiến trúc hệ thống).

## Structure
Cấu trúc của dự án này sẽ bao gồm các folder gồm file `index.ts` để làm file export tổng theo cấu trúc module. Tuy nhiên thì cốt lõi của tính module là ở `modules`, nơi sẽ thực hiện các nhiệm vụ chính trong app, các modules này chứa các handlers và các handlers này sẽ phụ thuộc vào một số configurations khác trong app để thực hiện các hành động đó.

__Chú thích__:
- `classes`: folder này chứa một số class global, thường thì là những classes gây ảnh hưởng lên toàn app.
  - `MyServer`: tạo ra một object dùng để quản lý server, có một số thuộc tính, xem thêm trong file để biết thêm chi tiết.
  - `ServerBuilder`: tạo ra một object dùng để build server.
- `db`: folder này dùng để chứa các configs của MongoDB. Với mỗi folder sẽ là một DB.
- `templates`: folder này chứa các function dùng để tạo ra một số object khác trong app, nó dùng cho global.
  - `router`: tạo ra một router, router này nhận vào các handlers để set-up API cho sau này.
  - `handler`: tạo ra một function dùng để xử lý các request từ client và response về cho client. Giúp tiết kiệm thời gian cho việc tạo handler api.
- `modules`: folder này chứa các module để thực hiện yêu cầu từ client, cái này không cần phải giải thích thêm.
- `services`: là các service từ bên ngoài, có thể kể đến như là google, cloudinary.
- `types`: chứa type trong project.
- `utils`: các hàm helpers.
- `index.ts`: file này dùng để set-up, config server và chạy!!!

### Folder Structure
```
.
└── src/
    ├── classes/
    │   ├── MyServer.ts
    │   └── ServerBuilder.ts
    ├── db/
    │   ├── temp_a/
    │   │   ├── models
    │   │   └── index.ts
    │   └── temp_b/
    │       ├── models
    │       └── index.ts
    ├── templates/
    │   ├── router/
    │   │   └── index.ts
    │   └── handler/
    │       └── index.ts
    ├── modules/
    │   └── post/
    │       ├── handlers/
    │       │   ├── createPost.ts
    │       │   └── getPost.ts
    │       └── index.ts
    ├── services/
    │   ├── cloudinary/
    │   │   └── index.ts
    │   └── google/
    │       └── index.ts
    ├── types/
    │   └── index.ts
    ├── utils/
    │   ├── string.ts
    │   ├── number.ts
    │   ├── security.ts
    │   └── index.ts
    ├── types/
    │   └── index.ts
    └── index.ts
```

### System Architecture*
![image](https://github.com/NguyenAnhTuan1912/node-project-structures/assets/86825061/c752cbe6-ace9-4a13-ba51-212b4a6beec8)

Như đã nói thì cấu trúc được thiết kế theo dạng tập trung. Các công việc mà mình cần xử lý riêng như là lấy dữ liệu từ trong cơ sở dữ liệu; sử dụng api/dữ liệu từ các services khác; và các function hỗ trợ sẽ được tập trung lại trong `template`. `MyServer` sẽ chịu trách nhiệm thực thi các cài đặt được set từ `ServerBuilder` như là middlewares, routers... Cuối cùng là các global middlewares, routers, MyServer, ServerBuilder được import vào trong `src/index.ts` để setup cho server. Kiến trúc của nó chỉ đơn giản như vậy thôi.

Kiến trúc được thiết kết trừu tượng, nhưng phải đảm bảo export các đối tượng sau:
- Router: đã được setup từ các handlers, các handlers này được cài đặt cụ thể và dùng Utils, Databases, Services để hỗ trợ.
- Global Middlewares: các middlewares toàn cục (không bắt buộc, tuy nhiên một số thì buộc phải có).
- Server Manager: bao gồm chính nó (ở đây là MyServer) và một Builder cho server.

### Code Installation*
Project dùng OOP (khoảng 40%, nhưng tương lai sẽ ráng update lên 100%) làm kim chỉ nam cho việc cài đặt code. Và việc cài đặt code là phần quan trọng trong project-template này.

#### Server and Server Builder
Server là một object chứa instance của:
- express (`app`), http-server (`instance`): Để setup và khởi động server.
- `dbConnections`: là các kết nối tới DB, cụ thể là mongoDB. (Chưa test với các loại db khác nhau).
- `apis`: là các routes từ các Routers.
- `middlewares`: là tất cả các middle-wares.

Ở đây thì mình sẽ dùng Server Builder để thêm các `apis`, `middlewares` và `dbConnections` để cho server cài đặt sau, sau khi đã kết nối được tới DBs trong `dbConnections`.

#### Database
Ở đây dùng chủ yếu là MongoDB. Được chia thành các database khác nhau, trong mỗi DB này sẽ có các model (là các collection). Mỗi collection này là một class, chứa schema và các method dùng để giao tiếp với DB đó. Các DB này là rời rạc và được import vào `src/index.ts` để config.

#### Modules
Sẽ bao gồm `handler` và `router`. Các handlers sẽ được tập trung lại và cài đặt vào trong Router, và export Router này để config trong `src/index.ts`. Tại đây các handlers và routers sẽ dùng các function trong templates để tạo.

Ok đó là phần cài đặt code, xem trong `src` để dễ hiểu hơn.

## Pros and Cons
Vẫn đang trong quá trình phát triển và tìm hiểu cấu trúc này, cho nên là vẫn chưa nhận thấy nhiều điểm tiện/bất tiện.
### Props
- Dễ quản lý hơn.
- Độ sâu của source thấp.
- Dễ mở rộng, bảo trì.
- Dễ theo dõi source hơn. Ví dụ như thêm model mới trong mongodb hay thêm service mới thì mình có thể biết được service đó được thêm trong `services` và service này có được dùng hay không ở trong `template/handler`.

### Cons
- Vẫn còn hạn chế về mặt cài đặt code.

__NOTE__: sẽ còn được phát triển thêm. Và nên nhớ đây chỉ là template thôi, còn tuỳ thuộc vào dự án mà config thêm.
