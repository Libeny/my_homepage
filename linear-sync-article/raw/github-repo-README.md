# Reverse Engineering Linear's Sync Engine: A Detailed Study

> This is a pretty awesome (and correct) write-up of our sync engine. ([link](https://github.com/wzhudev/reverse-linear-sync-engine/discussions/2#discussioncomment-12892194))
> 
> ...probably the best documentation that exists - internally or externally. ([link](https://x.com/artman/status/1927808159139111007))
>
> ...documentation that is correct and more complete than what Linear publishes internally. ([link](https://news.ycombinator.com/item?id=44123131))
> 
> -- Tuomas Artman (Co-founder and CTO of Linear) 

![](./imgs/title-image.png)

> [!IMPORTANT]
> Check out the [SUMMARY](./SUMMARY.md)
> 
> My friends found this too long, so I wrote a summary highlighting the key points—making it a 10-minute read. If you're only interested in the main ideas or want to skip the implementation details, just read the summary.

**Join in [discussion](https://github.com/wzhudev/reverse-linear-sync-engine/discussions/2).**

I work on collaborative softwares, focusing on rich text editors and spreadsheets. **Collaboration engines**, also known as **data sync engines**, play a pivotal role in enhancing user experience in these softwares. They enable real-time, simultaneous edits on the same file while offering features like offline availability and file history. Typically, engineers use **[Operational Transformation (OT)](https://en.wikipedia.org/wiki/Operational_transformation)** or **[Conflict-free Replicated Data Types (CRDTs)](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)** to build sync engines. While these technologies are effective for editors and spreadsheets, they may not be ideal for other types of applications. Here's why.

OT is widely adopted but notorious for its complexity. This complexity stems from the need to account for diverse data models and operation sets across different applications, which requires significant effort to implement correct operations and transformation functions. While OT excels at synchronizing edits, preserving user intent, and handling conflicts, its complexity often makes it overkill for simpler use cases—such as managing user information or file metadata—where a straightforward **last-writer-wins** approach might suffice.

CRDTs, on the other hand, appear more user-friendly. They offer built-in support for fundamental data structures (e.g., texts, lists, maps, counters), reducing the workload for developers. However, CRDTs often introduce metadata overhead and become challenging to manage in scenarios involving partial syncing or permission controls—such as when users can only access a subset of files. These issues arise because CRDTs are primarily designed for decentralized systems, while most modern applications still depend on centralized servers. Although I am personally an advocate of CRDTs, they often fall short for some use cases.

What I look for in a sync engine includes:

1. **Support for arbitrary data models**: Making it adaptable to a wide range of scenarios.
2. **Rich features**: It should support partial syncing, enforce permission control, and include features like undo/redo, offline availability, and edit history.
3. **Great developer experience**: Ideally, it should allow model definitions in an ORM-like manner. Developers should not need to be experts in sync engines to build collaborative applications.

[Linear](https://linear.app)'s Linear Sync Engine (LSE) provides an elegant solution to all the aforementioned requirements. Moreover, it offers an intuitive API that abstracts away the underlying complexity, making feature development significantly simpler. For instance, updating the title of an issue can be as straightforward as:

```jsx
issue.title = "New Title";
issue.save();
```

I believe LSE is exactly what I've been looking for, so I decided to reverse-engineer its frontend code to understand how it works. Additionally, I'm documenting my findings to help others who are interested as I am.

> [!NOTE]
> Good References
>
> This [gist](https://gist.github.com/pesterhazy/3e039677f2e314cb77ffe3497ebca07b#gistcomment-5184039) introduces some off-the-shelf solutions, such as ElectricSQL and ZeroSync (which, BTW, I am also very curious about), for general-purpose synchronization. You might want to check them out as well.

In this post, we will explore how LSE:

- Defines models, properties, and references.
- Uses **MobX** to make models observable.
- Performs **bootstrapping**.
- Builds and populates a local database (IndexedDB).
- Hydrates lazily-loaded data.
- Syncs clients with the server.
- Handles undo and redo.

To help you better understand how the Linear Sync Engine (LSE) works at the code level, I've uploaded a version of Linear's (uglified) code with detailed comments. These annotations provide additional insights that may not be covered in this post. Since the identifiers' names are obfuscated, I've done my best to infer their possible original names. At the end of the post, you'll also find a table mapping abbreviated terms to their full forms.

For the best experience, I recommend cloning the repository and viewing the code in your favorite editor. This allows you to refer to the code alongside the text for a more seamless reading experience. Personally, I suggest using VS Code because its TypeScript language service handles large files exceptionally well. Additionally, I'll include callouts at the beginning of each section to highlight relevant code snippets. You can easily jump to these by searching for symbols using the shortcut <kbd>Ctrl + Shift + O</kbd> (or <kbd>Meta + Shift + O</kbd> on macOS).

![search-for-symbols](./imgs/search-for-symbols.png)

I am not affiliated with the Linear team, nor have I consulted them while writing this article. As a result, there may be inaccuracies or discrepancies with the actual implementation. However, I've made every effort—especially by watching relevant talks and comparing LSE to well-studied operational transformation (OT) approaches—to ensure that my description of the LSE approach is as accurate as possible. I hope it serves as a valuable reference for building a similar collaborative engine. If you spot any errors or misleading information, please submit an issue or a pull request to help me correct it. Your feedback is greatly appreciated!

That said, I may inevitably fall victim to the [curse of knowledge](https://en.wikipedia.org/wiki/Curse_of_knowledge). If anything is unclear, the fault is mine, and I'd be more than happy to provide further explanations. Feel free to open an issue, and I'll gladly add more details—or even diagrams—to make the article easier to understand.

With that out of the way, let's dive in!

## Introduction

If you haven't yet watched Tuomas' [two](https://www.youtube.com/watch?v=WxK11RsLqp4&t=2175s) [ talks](https://linear.app/blog/scaling-the-linear-sync-engine), a [podcast](https://www.devtools.fm/episode/61), and a [presentation at Local First Conf](https://www.youtube.com/watch?v=VLgmjzERT08) about LSE, I highly recommend exploring them out before proceeding. These resources provide valuable context. However, here are the core concepts behind LSE:

![introduction to LSE](./imgs/introduction.png)

**Model**

Entities such as `Issue`, `Team`, `Organization`, and `Comment` are referred to as **models** in LSE. These models possess **properties** and **references** to other models, many of which are observable (via **MobX**) to automatically update views when changes occur. In essence, models and properties include **metadata** that dictate how they behave in LSE.

Models can be loaded from either the **local database** (IndexedDB) or the server. Some models supports **partially loading** and can be loaded on demand, either from the local database or by fetching additional data from the server. Once loaded, models are stored in an **Object Pool**, which serves as a large map for retrieving models by their **UUIDs**.

Models can be **hydrated** lazily, meaning its properties can be loaded only when accessed. This mechanism is particularly useful for improving performance by loading only the necessary data.

Operations—such as additions, deletions, updates, and archiving—on models, their properties, and references are encapsulated as **transactions**. These transactions are sent to the server, executed there, and then broadcast as **delta packets** to all connected clients. This ensures data consistency across multiple clients.

**Transaction**

Operations sent to the server are packaged as **transactions**. These transactions are intended to execute **exclusively** on the server and are designed to be **reversible** on the client in case of failure. If the client loses its connection to the server, transactions are temporarily **cached** in IndexedDB and automatically resent once the connection is reestablished.

Transactions are associated with a **sync id**, which is a monotonically increasing number that ensures the correct order of operations. This number is crucial for maintaining consistency across all clients.

Additionally, transactions play a key role in supporting **undo** and **redo** operations, enabling seamless changes and corrections in real-time collaborative workflows.

**Delta packets**

Once transactions are executed, the server broadcasts **delta packets** to all clients—including the client that initiated the transaction—to update the models. A delta packet contains several **sync action**s, and each action is associated with a **sync id** as well. This mechanism prevents clients from missing updates and helps identify any missing packets if discrepancies occur.

The **delta packets** may differ from the original transactions sent by the client, as the server might perform **side effects** during execution (e.g., generating history).

---

In the following chapters, we will explore these concepts in detail, along with the corresponding modules that manage them. We'll begin with the **"Model"**.

## Chapter 1: Defining Models and Metadata

First and foremost, we need to figure out how models are defined in LSE.

### `ModelRegistry`

> [!NOTE]
> Code references
>
> - `rr`: `ModelRegistry`

When Linear starts, it first generates metadata for models, including their properties, methods (actions), and computed values. To manage this metadata, LSE maintains a detailed dictionary called `ModelRegistry`.

![model registry](./imgs/model-registry.png)

> [!NOTE]
> Uglified Names
>
> The names in the screenshots (e.g., Xs) may differ from those in the GitHub source code (rr). Additionally, names may vary across different screenshots. This is completely normal, as Linear ships nearly every half hour!

`ModelRegistry` is a class with static members that store various types of metadata and provide methods for registering and retrieving this information. For example:

- **`modelLookup`**: Maps a model's name to its constructor.
- **`modelPropertyLookup`**: Stores metadata about a model's properties.
- **`modelReferencedPropertyLookup`**: Stores metadata about a model's references.
- etc.

We will discuss how some of this metadata is registered in this chapter, focusing particularly on models and their properties.

### Model

> [!NOTE]
> Code references
>
> - `We`: `ClientModel` decorator
> - `as`: `Model` base model class
> - `re` `Vs`: `Issue` model class
> - `rr.registerModel`: `ModelRegistry.registerModel`

![](./imgs/models.png)

LSE uses JavaScript's `class` keyword to define models, with all model classes extending the base `Model` class. This base class provides the following key properties and methods:

- **`id`**: A unique UUID assigned to each model, serving as the key for retrieving the model from the Object Pool.
- **`_mobx`**: An empty object required to make the model observable, as detailed in the "Observability" section.
- **`makeObservable`**: A method for enabling observability. By default, models are not observable upon construction, so this method must be invoked at the appropriate time.
- **`store`**: A reference to `SyncedStore`, which will be explored in depth in later chapters.
- **`propertyChanged`, `markPropertyChanged`, `changeSnapshot`**: Methods that track property changes and generate an `UpdateTransaction`.
- **etc.**: Additional important properties and methods will be discussed in subsequent chapters.

> [!NOTE]
> While writing this post, the Linear team updated how properties are stored. The `_mobx` object was removed, and each model now uses a `__data` property to store property values. This change affects the implementation of certain decorators and the hydration process. However, it does not impact our understanding of LSE, so I have not revised the related sections of this post.

Models' metadata includes:

1. **`loadStrategy`**: Defines how models are loaded into the client. There are five strategies:
   - **`instant`**: Models that are loaded during application bootstrapping (default strategy).
   - **`lazy`**: Models that do not load during bootstrapping but are fetched all at once when needed (e.g., `ExternalUser`).
   - **`partial`**: Models that are loaded on demand, meaning only a subset of instances is fetched from the server (e.g., `DocumentContent`).
   - **`explicitlyRequested`**: Models that are only loaded when explicitly requested (e.g., `DocumentContentHistory`).
   - **`local`**: Models that are stored exclusively in the local database. No models have been identified using this strategy.
2. **`partialLoadMode`**: Specifies how a model is hydrated, with three possible values: `full`, `regular`, and `lowPriority`.
3. **`usedForPartialIndexes`**: Relates to the functionality of partial indexing.
4. etc.

![](./imgs/count-of-models.png)

_When I started writing this post, there were 76 models in Linear. As I am about to finish, there are 80 models._

> [!NOTE]
> What is `local` used for?
>
> You might wonder what the `local` load strategy is used for, given that no models currently use it.
> In his presentation at Local First Conf, Tuomas explained how new features can be developed without modifying server-side code. My guess is that this is achieved by initially setting a new model's load strategy to `local`, ensuring it persists only in the local IndexedDB. Once the model is finalized, syncing can be enabled by changing its load strategy to one of the other available strategies.

LSE uses **TypeScript decorators** to register metadata in `ModelRegistry`. The decorator responsible for registering models' metadata is `ClientModel` (also known as `We`).

For example, consider the `Issue` model:

```tsx
re = Pe([We("Issue")], re);
```

The original source code may looks like this:

```typescript
@ClientModel("Issue")
class Issue extends Model {}
```

In the implementation of `ClientModel`:

1. The model's name and constructor function are registered in `ModelRegistry`'s `modelLookup`.
2. The model's name, schema version, and property names are combined into a **hash value**, which is registered in `ModelRegistry` and used to check the database schema. If the model's `loadStrategy` is `partial`, this information is also included in the hash.

You can refer to the source code for more details about how `ClientModel` works.

### Properties

> [!NOTE]
> Code references
>
> - `vn`: `PropertyTypeEnum` enumeration
> - `w`: `Property` decorator
> - `pe`: `Reference` decorator
> - `A4`: `registerReference` helper function
> - `rr.registerModel`: `ModelRegistry.registerModel`
> - `rr.registerProperty`: `ModelRegistry.registerProperty`

Models have properties that are implemented as JavaScript class properties. Each property is associated with property metadata, which includes key fields such as:

1. `type`: Specifies the property's type.
2. `lazy`: Specifies whether the property should be loaded only when the model is hydrated.
3. `serializer`: Defines how to serialize the property for data transfer or storage.
4. `indexed`: Determines whether the property should be indexed in the database. Used for references.
5. `nullable`: Specifies whether the property can be `null`, used for references.
6. etc.

`type` is an enumeration that includes the following values:

1. **`property`**: A property that is "owned" by the model. For example, `title` is a `property` of `Issue`.
2. **`ephemeralProperty`**: Similar to a `property`, but it is not persisted in the database. This type is rarely used. For example, `lastUserInteraction` is an ephemeral property of `User`.
3. **`reference`**: A property used when a model holds a reference to another model. Its value is typically the ID of the referenced model. A reference can be lazy-loaded, meaning the referenced model is not loaded until this property is accessed. For example, `subscription` is a `reference` of `Team`.
4. **`referenceModel`**: When `reference` properties are registered, a `referenceModel` property is also created. This property defines getters and setters to access the referenced model using the corresponding `reference`.
5. **`referenceCollection`**: Similar to `reference`, but it refers to an array of models. For example, `templates` is a `referenceCollection` of `Team`.
6. **`backReference`**: A `backReference` is the inverse of a `reference`. For example, `favorite` is a `backReference` of `Issue`. The key difference is that a `backReference` is considered "owned" by the referenced model. When the referenced model (B) is deleted, the `backReference` (A) is also deleted.
7. **`referenceArray`**: Used for many-to-many relationships. For example, `members` of `Project` is a `referenceArray` that references `Users`, allowing users to be members of multiple projects.

LSE uses a variety of decorators to register different types of properties. In this chapter, let's first look at three of them.

#### `Property` (`w`)

Let's take the `Issue` model as an example. `priority` and `title` are declared as properties of type `property` of `Issue`:

```tsx
Pe([w()], re.prototype, "title", void 0);
Pe(
  [
    w({
      serializer: P_,
    }),
  ],
  re.prototype,
  "priority",
  void 0
);
```

The original source code may look like this:

```tsx
@ClientModel("Issue")
class Issue extends Model {
  @Property()
  public title: string;

  @Property({ serializer: PrioritySerializer })
  public priority: Priority;
}
```

In the implementation of `Property`:

1. The property is made observable by calling `M1`, which will be covered in the [Observability](#observability-m1) section.
2. The property is registered in `ModelRegistry`.

Please refer to the source code for more details.

#### `Reference` (`pe`) and `OneToMany` (`Nt`)

For example, `assignee` is a `reference` of `Issue`, as each issue can be assigned to only one user. On the other hand, `assignedIssues` is a `LazyReferenceCollection` of `User`, as a user can have many assigned issues.

```tsx
Pe(
  [
    pe(() => K, "assignedIssues", {
      nullable: !0,
      indexed: !0,
    }),
  ],
  re.prototype,
  "assignee",
  void 0
);

st([Nt()], K.prototype, "assignedIssues", void 0);
```

The original source code may look like this:

```tsx
@ClientModel("Issue")
class Issue extends Model {
 @Reference(() => User, "assignedIssues", {
   nullable: true,
   indexed: true,
 })
 assignee: User | null;
}

@ClientModel("User")
class User extends Model {
  @OneToMany()
  assignedIssues: LazyReferenceCollection;

  constructor() {
    this.assignedIssues = new LazyReferenceCollection(Issue, this, "assigneeId", undefined, {
      canSkipNetworkHydration: () => this.canSkipNetworkHydration(Issue)
    }),
  }
}
```

In the implementation of the `Reference` decorator (more specifically, the `registerReference` function), two properties are actually registered: `assignee` and `assigneeId`.

They are of different types. `assignee` is of type `referenceModel`, while `assigneeId` is of type `reference`. The `assignee` property is not persisted in the database; only `assigneeId` is.

LSE uses a getter and setter to link `assigneeId` and `assignee`. When the `assignee` value is set, `assigneeId` is updated with the new value's `ID`. Similarly, when `assignee` is accessed, the corresponding record is fetched from the data store using the `ID`.

Additionally, `assigneeId` is made observable with `M1`.

![model property lookup](./imgs/model-property-lookup.png)

_There are lots of `referenceModel` and `reference` pairs in the `ModelRegistry`._

### Schema Hash

`ModelRegistry` includes a special property called **`__schemaHash`**, which is a hash of all models' metadata and their properties' metadata. This hash is crucial for determining whether the local database requires migration, a topic covered in detail in a later chapter. I have already added comments in the source code explaining how it is calculated, so I won't repeat that here.

> [!NOTE]
> TypeScript Decorators
>
> When TypeScript transpiles decorators, it processes property decorators before model decorators. As a result, property decorators are executed first. By the time `ModelRegistry.registerModel` is called, all properties of that model have already been registered, and their metadata will also be included in the `__schemaHash`.

### Observability (`M1`)

> [!NOTE]
> Code references
>
> - `M1`: `observabilityHelper`

The `M1` function plays a critical role in making models and properties observable.

It uses `Object.defineProperty` to define a getter and setter for the property that needs to be observable. When a value is assigned to the property, the setter checks whether a MobX box needs to be created on `__mobx` and assigns the value to that box.

The same logic applies to the getter, which ensures that if the box exists, it retrieves the value from it. By wrapping React components with `observer`, MobX can track which components subscribe to the observables and automatically refresh them when the observable values change.

Additionally, when setting the value, the `propertyChanged` method is called to register the property change, along with the old and new values. This information will later be used to create an `UpdateTransaction`, which we'll discuss in a the third chapter.

Check the source code for more details.

### Takeaway of Chapter 1

Let's summarize the key points covered in this chapter:

- **Models and Properties in LSE**: Governed by metadata that defines their behavior.
- **Model Definition**: LSE defines models using JavaScript classes and utilizes decorators to register models, properties, and references in the `ModelRegistry`.
- **Load Strategies**: Models can be loaded using different strategies, including `instant`, `lazy`, `partial`, `explicitlyRequested`, and `local`.
- **Property Types**: LSE categorizes properties into several types, such as `property`, `reference`, `referenceModel`, `referenceCollection`, `backReference`, and `referenceArray`.
- **Reactive Data Handling**: LSE uses `Object.defineProperty` to implement getters and setters, enabling efficient reference handling and observability.

In the upcoming chapters, we'll explore how this metadata is leveraged in practice. Keep reading! 🚀

## Chapter 2: Bootstrapping & Lazy Loading

Once the models are defined, the next step is to **load them into the client**. In this chapter, we'll explore how LSE **bootstraps and lazily loads models**.

We'll start with a high-level overview to establish a foundational understanding before diving into more intricate details. Since this process involves multiple modules, I'll also provide brief introductions to each for better context.

![bootstrapping overview](./imgs/bootstrapping-overview.png)

1. `StoreManager` (`cce`) creates either a `PartialStore` (`jm`) or a `FullStore` (`TE`) for each model. These stores are responsible for synchronizing in-memory data with IndexedDB. Also, `SyncActionStore` (`oce`) will be created to store sync actions.
2. `Database` (`eg`) connects to IndexedDB and get databases and tables ready. If the databases don't exist, they will be created. And if a migration is needed, it will be performed.
3. `Database` determines the type of bootstrapping to be performed.
4. The appropriate bootstrapping is executed. For full bootstrapping, models are retrieved from the server.
5. The retrieved model data will be stored in IndexedDB.
6. Data requiring immediate hydration is loaded into memory, and observability is activated.
7. Build a connection to the server to receive delta packets.

There are three types of bootstrapping in LSE: **full bootstrapping**, **partial bootstrapping**, and **local bootstrapping**. In this post, I'll focus on providing a detailed explanation of **full bootstrapping**.

### Create `ObjectStore`s

> [!NOTE]
> Code references
>
> - `cce`: `StoreManager`
> - `p3`: `PartialStore`
> - `TE`: `FullStore`
>
> The bootstrapping process begins with `km.startBootstrap` (`SyncedStore.startBootstrap`). `StoreManager` is lazily created through the getter `eg.storeManager` (`Database.storeManager`).

The first step in the bootstrapping process is the construction of `StoreManager`. This module is responsible for creating and managing `ObjectStore` instances for each model registered in the `ModelRegistry`. Each `ObjectStore` handles the corresponding table for its model in IndexedDB.

![object-stores.png](./imgs/object-stores.png)

_There are 80 kinds of models so there are 80 `ObjectStore` consequently._

As mentioned earlier, models have `loadStrategy` metadata, and LSE generates corresponding store types based on this field. Models with a `partial` load strategy are managed by `PartialObjectStore` (`p3`, `Jm`), while all other models use `FullObjectStore` (`TE`).

When an `ObjectStore` is created, it computes a hash for its associated model, which is used as the table's name in the database. For example, the `Issue` model has a `storeName` of `119b2a...`, corresponding to a table with the same hash.

![](./imgs/model-store-class.png)

![](./imgs/model-store-db.png)

Notably, for models with a `loadStrategy` of `partial`, an additional database named `<hash>_partial` will be created. This database stores indexes that facilitate lazy loading of these models. We will explore this mechanism in detail at the end of this chapter.

![](./imgs/model-partial-store-db.png)

### Create Databases & Tables in IndexedDB

> [!NOTE] 
> Code references
>
> - `eg.open`: `Database.open`
> - `jn` or `Xn`: `DatabaseManager` - `databaseInfo`, `registerDatabase`, `database`
> - `cce.checkReadinessOfStores`: `StoreManager.checkReadinessOfStores`
> - `TE.checkIsReady`: `SyncStore.checkIsReady`

After `ObjectStore`s are constructed, the next step is to prepare the database—creating the databases and tables if they don't already exist in IndexedDB.

LSE maintains two types of databases in IndexedDB: `linear_databases` and others with names like `linear_(hash)`.

**`linear_databases`**: This database stores information about other databases. LSE creates a separate database for each logged-in user in a workspace. If the user is part of multiple workspaces, LSE creates a database for each logged-in workspace.

![linear databases](./imgs/linear-databases.png)

The database information includes:

1. **`name`**: The database's name. It is derived from the `userId`, `version`, and `userVersion`. As a result, different user identities lead to multiple databases.
2. **`schemaHash`**: Used for database migration. This corresponds to the `_schemaHash` property in `ModelRegistry`.
3. **`schemaVersion`**: An incremental counter that determines if a database migration is necessary. If the new `schemaHash` differs from the one stored in IndexedDB, the counter increments. The updated version is then passed as the second parameter to [`IndexedDB.open`](http://indexdb.open/) to check if migration is needed.

and so on. You can checkout how this information is calculated in `jn.databaseInfo`.

**`linear_(hash)`**: This database contains the data of a workspace. For example, `linear_b4782b3125a816b51a44e59f2e939efa` stores the data for my private workspace.

Inside these databases, there are tables for each model, as we discussed in the previous section. Additionally, it includes two special tables:

The first table is **`_meta`**, which holds persistence details for each model, as well as the database's metadata.

![](./imgs/meta-persistence.png)

_Model persistence state._

Each model has a corresponding record in the `_meta` table. If the `persisted` field is set to `true`, it indicates that all instances of that model within the workspace have been loaded onto the client.

![](./imgs/meta-meta.png)

_Database's metadata_

The database's metadata fields includes:

1. `lastSyncId`.

---

**`lastSyncId`** is a critical concept in LSE, so allow me to introduce it here. You might find that it ties into concepts like transactions and delta packets, which we will explore in greater detail in the later chapters. It's perfectly fine if you don't fully grasp this part right now. Keep reading and refer back to this section after you've covered the upcoming chapters—everything will come together.

Linear is often regarded as a benchmark for [local-first software](https://www.inkandswitch.com/local-first/). Unlike most mainstream local-first applications that use CRDTs, Linear's collaboration model aligns more closely with OT, as it relies on a centralized server to establish the order of all transactions. Within the LSE framework, all transactions sent by clients follow a [total order](https://en.wikipedia.org/wiki/Total_order), whereas CRDTs typically require only a [partial order](https://en.wikipedia.org/wiki/Partially_ordered_set). This total order is represented by the `sync id`, which is an incremental integer. And `lastSyncId` is the latest `sync id` as you can tell from its name.

When a transaction is successfully executed by the server, the global **`lastSyncId`** increments by 1. This ID effectively serves as the **version number of the database**, ensuring that all changes are tracked in a sequential manner.

![](./imgs/lastsyncid.png)

__Each changes in the database increments the `lastSyncId` by 1. And the `lastSyncId` is also associated with the transaction and the delta packet.__

The server includes the updated `lastSyncId` in its response to the client that initiated the transaction. Additionally, when the server broadcasts delta packets (which represent incremental changes) to all clients, these packets are also associated with the corresponding `lastSyncId`. This ensures that clients can synchronize their local state with the server using the latest database version.

The concept of `sync id` is similar to a **file revision number** in operational transformation (OT) algorithms. (For more details, you can check out my [detailed article on OT](https://wzhu.dev/posts/ot).) However, unlike a file revision number that typically applies to a single file, **`lastSyncId` spans the entire database**, regardless of which workspace the changes occur in.

This broader scope can be observed in practice: even if a single transaction happens in your workspace, the `lastSyncId` often increments significantly, indicating that it is tracking changes across all workspaces in the system.

Clients use the **`lastSyncId`** to determine whether they are synchronized with the server. By comparing their local `lastSyncId` with the `lastSyncId` provided by the server, clients can identify if they are missing any transactions:

- If the client's `lastSyncId` is **smaller** than the server's, it indicates that the client is out of sync and has not received some delta packets.
- The server frequently includes the `lastSyncId` in its responses to help clients stay updated.

The client's `lastSyncId` is initially set during the **full bootstrapping process**, where it retrieves the latest state of the database. As the client receives **delta packets** from the server, the `lastSyncId` is updated to reflect the new synchronized state.

Now back to other fields of database's metadata.

---

2. **`firstSyncId`**: Represents the `lastSyncId` value when the client performs a **full bootstrapping**. As we'll see later, this value is used to determine the starting point for incremental synchronization.
3. **`backendDatabaseVersion`**: Indicates the version of the backend database. The name is self-explanatory and is used to track compatibility between the client and server databases.
4. **`updatedAt`**: A timestamp indicating the last time the database or its metadata was updated. The name is straightforward.
5. **`subscribedSyncGroups`**.

---

This concept is crucial in LSE. While all workspaces share the same `lastSyncId` counter, you cannot access issues or receive delta packets from workspaces or teams to which you lack proper permissions. This restriction is enforced through an access control mechanism, with `subscribedSyncGroups` serving as the key component. The `subscribedSyncGroups` array contains UUIDs that represent your user ID, the teams you belong to, and predefined roles.

> [!NOTE]  
> Understanding how `SyncGroup` works was particularly challenging in earlier versions of LSE. However, the introduction of `userSyncGroup` and `teamSyncGroup` in recent updates by the Linear team has clarified its purpose. These changes reveal that a `SyncGroup` is essentially a collection of models linked to either a specific "User" or "Team."

> [!NOTE] 
> Linear's Database Metadata Changes  
> In late 2024, Linear modified the database metadata fields. While this screenshot reflects the updated metadata, the source code excerpts were taken before the change. For example, `subscribedSyncGroups` is replaced by `userSyncGroups`. Since this update does not significantly impact the core concepts of how LSE works, I will omit these differences in this post.

---

The explanation above covered the `_meta` table. Now, let's discuss the second special table: **`_transaction`**. This table stores unsent transactions or those queued for server synchronization. We'll delve deeper into the details of transactions in the next chapter.

![](./imgs/cached-transactions.png)

_Cached transactions_

Let's return to the bootstrapping process and explore how these two types of databases are created in IndexedDB. Please refer to `ng.initializeDatabase` (`SyncClient.initializeDatabase`) for source code and comments.

**Step 1: Retrieve Workspace Metadata**

The process begins by retrieving the metadata for the workspace being bootstrapped via the `Xn.databaseInfo` method. During this step, if the `linear_databases` database has not yet been created, it will be initialized. Once the metadata is successfully retrieved, it is stored in the `linear_databases` database using the `Xn.registerDatabase` method.

**Step 2: Create the Workspace-Specific Database**

Next, LSE prepares the workspace-specific database, such as `linear_b4782b3125a816b51a44e59f2e939efa`. It first establishes a connection to the database and evaluates whether it needs to be created or migrated. If creation or migration is required, the `StoreManager` invokes its `createStores` method (`this.storeManager.createStores(i, l)`) to initialize the necessary tables for the models.

At this stage, LSE also attempts to read the database's metadata. However, during a full bootstrapping process, no metadata is stored yet, so all fields are initialized to `0` or other default values.

**Step 3: Check Store Readiness**

The final stage involves verifying the readiness of each store. During the first load, as all tables are initially empty, so none of the stores will be ready.

At this point, LSE has prepared the databases and is ready to load data from the server. Let's dive deeper into how this process works.

### Determine the Bootstrapping Type

> [!NOTE]
> Code references
>
> - `ng.bootstrap`: `SyncClient.bootstrap`
> - `eg.requiredBootstrap`: `Database.requiredBootstrap`

The next step in the process is determining the bootstrapping type and executing it.

The `Database.requiredBootstrap` method identifies the appropriate bootstrapping type and supplies the necessary parameters for its execution. The method returns an object with the following fields:

1. **`type`**: The type of bootstrapping to perform.

---

There are three types of bootstrapping:

1. **`full`**: LSE retrieves all required models from the server.
2. **`local`**: Data is loaded from the local database, and the application synchronizes with the server using incremental deltas.
3. **`partial`**: A subset of models is loaded from the server, depending on the load strategy.

**LSE performs a full bootstrapping** in the following scenarios (excluding demo project logic for simplicity):

1. **No stores are ready**: Newly created tables, as discussed earlier, are still empty and unavailable.
2. **`lastSyncId` is undefined**: This indicates the database lacks a record of the last synchronization point.
3. **Models are outdated**: When the client is online, and some models are outdated, a full bootstrap refreshes all data.

This post will focus on the **full bootstrapping** process.

---

Additional fields in the `requiredBootstrap` 's return include:

2. **`modelsToLoad`**: Names of the models with a load strategy marked as either **instant** or **lazy**.
3. **`lastSyncId`**: Indicates the database snapshot the client is currently synchronized to. During full bootstrapping, this value is zero, as no data has yet been loaded from the server. In this case, the server will returns the latest snapshot.

### Bootstrapping the Database

> [!NOTE] 
> Code references
>
> 1. `ng.bootstrap`: `SyncClient.bootstrap`
> 2. `eg.bootstrap`: `Database.bootstrap`
> 3. `Xm.fullBootstrap`: `BootstrapHelper.fullBootstrap`
> 4. `sd.restModelsJsonStreamGen`: `GraphQLClient.restModelsJsonStreamGen`

When LSE initiates a full bootstrapping process, it sends a request through the `GraphQLClient.restModelsJsonStreamGen` method. This function is responsible for retrieving models from the server and will be referenced multiple times throughout the remainder of this article.

The request would look like this:

```
https://client-api.linear.app/sync/bootstrap?type=full&onlyModels=WorkflowState,IssueDraft,Initiative,ProjectMilestone,ProjectStatus,TextDraft,ProjectUpdate,IssueLabel,ExternalUser,CustomView,ViewPreferences,Roadmap,RoadmapToProject,Facet,Project,Document,Organization,Template,Team,Cycle,Favorite,CalendarEvent,User,Company,IssueImport,IssueRelation,TeamKey,UserSettings,PushSubscription,Activity,ApiKey,EmailIntakeAddress,Emoji,EntityExternalLink,GitAutomationTargetBranch,GitAutomationState,Integration,IntegrationsSettings,IntegrationTemplate,NotificationSubscription,OauthClientApproval,Notification,OauthClient,OrganizationDomain,OrganizationInvite,ProjectLink,ProjectUpdateInteraction,InitiativeToProject,Subscription,TeamMembership,TimeSchedule,TriageResponsibility,Webhook,WorkflowCronJobDefinition,WorkflowDefinition,ProjectRelation,DiaryEntry,Reminder
```

It has two p