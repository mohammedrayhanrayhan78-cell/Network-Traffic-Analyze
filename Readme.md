# 🚦 Internet Traffic Signals

A collaborative project built by a team of 4 members.

## 👥 Team Workflow

We use GitHub branches to work on different features independently and merge completed work into the `main` branch.

```mermaid
flowchart TD
    A[🚀 GitHub Repository] --> B[main Branch]

    B --> C[👨‍💻 Rayhan Branch]
    B --> D[👨‍💻 Friend 1 Branch]
    B --> E[👨‍💻 Friend 2 Branch]
    B --> F[👨‍💻 Friend 3 Branch]

    C --> G[💻 Develop Feature]
    D --> H[💻 Develop Feature]
    E --> I[💻 Develop Feature]
    F --> J[💻 Develop Feature]

    G --> K[📤 Push Branch]
    H --> L[📤 Push Branch]
    I --> M[📤 Push Branch]
    J --> N[📤 Push Branch]

    K --> O[🔍 Pull Request]
    L --> O
    M --> O
    N --> O

    O --> P[👥 Team Review]
    P --> Q[✅ Merge into main]

    Q --> B
