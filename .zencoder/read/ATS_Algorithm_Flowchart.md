# ATS Scoring Algorithm Flowchart

## 🔄 Algorithm Flow Overview

```mermaid
flowchart TD
    A[Profile Data Input] --> B{Profile Exists?}
    B -->|No| C[Return Score: 0]
    B -->|Yes| D[Initialize Score: 0]
    
    D --> E[Skills Analysis]
    E --> F[Education Analysis]
    F --> G[Resume Analysis]
    G --> H[Internship Analysis]
    
    E --> E1{Skills Array Empty?}
    E1 -->|Yes| E2[Skills Score: 0]
    E1 -->|No| E3[Count Technical Skills]
    E3 --> E4[Count Soft Skills]
    E4 --> E5[Calculate Skills Score]
    E5 --> E6[Add to Total Score]
    
    F --> F1{Education Array Empty?}
    F1 -->|Yes| F2[Education Score: 0]
    F1 -->|No| F3[Analyze Each Education Entry]
    F3 --> F4[Check Degree Keywords]
    F4 --> F5[Check Institution Quality]
    F5 --> F6[Calculate Education Score]
    F6 --> F7[Add to Total Score]
    
    G --> G1{Resume URL Exists?}
    G1 -->|No| G2[Resume Score: 0]
    G1 -->|Yes| G3[Base Score: 20]
    G3 --> G4{HTTPS URL?}
    G4 -->|Yes| G5[Bonus: +5]
    G4 -->|No| G6[No Bonus]
    G5 --> G7[Add to Total Score]
    G6 --> G7
    
    H --> H1{Internship Title?}
    H1 -->|Yes| H2[Score: +10]
    H1 -->|No| H3[Score: +0]
    H2 --> H4{Internship Type?}
    H3 --> H4
    H4 -->|Yes| H5[Score: +5]
    H4 -->|No| H6[Score: +0]
    H5 --> H7{Preferred Location?}
    H6 --> H7
    H7 -->|Yes| H8[Score: +5]
    H7 -->|No| H9[Score: +0]
    H8 --> H10[Add to Total Score]
    H9 --> H10
    
    E6 --> I[Final Score Calculation]
    F7 --> I
    G7 --> I
    H10 --> I
    
    I --> J[Round Score to Integer]
    J --> K[Ensure Score ≤ 100]
    K --> L[Return Final ATS Score]
    
    L --> M[Generate Improvement Suggestions]
    M --> N[Update Database]
    N --> O[Return Complete Result]
```

## 📊 Scoring Component Breakdown

```mermaid
pie title ATS Score Distribution
    "Skills Analysis" : 30
    "Education Analysis" : 25
    "Resume Presence" : 25
    "Internship Details" : 20
```

## 🔍 Skills Analysis Sub-Flow

```mermaid
flowchart LR
    A[Skills Array] --> B[Technical Skills Check]
    A --> C[Soft Skills Check]
    
    B --> D[Count Technical Skills]
    C --> E[Count Soft Skills]
    
    D --> F[Base Score: Skills Count × 2]
    E --> G[Technical Bonus: Count × 2]
    E --> H[Soft Skills Bonus: Count × 1]
    
    F --> I[Total Skills Score]
    G --> I
    H --> I
    
    I --> J[Cap at 30 points]
```

## 🎓 Education Analysis Sub-Flow

```mermaid
flowchart TD
    A[Education Array] --> B{Array Empty?}
    B -->|Yes| C[Score: 0]
    B -->|No| D[For Each Education Entry]
    
    D --> E[Base Score: +5]
    E --> F[Check Degree Keywords]
    F --> G{Keyword Match?}
    G -->|Yes| H[Bonus: +2 per keyword]
    G -->|No| I[No bonus]
    
    H --> J[Check Institution]
    I --> J
    J --> K{University/College?}
    K -->|Yes| L[Bonus: +1]
    K -->|No| M[No bonus]
    
    L --> N[Add to Total]
    M --> N
    N --> O[Cap at 25 points]
```

## 📄 Resume Analysis Sub-Flow

```mermaid
flowchart TD
    A[Resume URL] --> B{URL Exists?}
    B -->|No| C[Score: 0]
    B -->|Yes| D[Base Score: 20]
    
    D --> E{HTTPS Protocol?}
    E -->|Yes| F[Security Bonus: +5]
    E -->|No| G[No bonus]
    
    F --> H[Total Resume Score: 25]
    G --> I[Total Resume Score: 20]
    
    H --> J[Cap at 25 points]
    I --> J
```

## 🏢 Internship Analysis Sub-Flow

```mermaid
flowchart TD
    A[Profile Data] --> B{Internship Title?}
    B -->|Yes| C[Title Score: 10]
    B -->|No| D[Title Score: 0]
    
    C --> E{Internship Type?}
    D --> E
    E -->|Yes| F[Type Score: 5]
    E -->|No| G[Type Score: 0]
    
    F --> H{Preferred Location?}
    G --> H
    H -->|Yes| I[Location Score: 5]
    H -->|No| J[Location Score: 0]
    
    I --> K[Total Internship Score]
    J --> K
    K --> L[Cap at 20 points]
```

## 🔧 Suggestion Generation Flow

```mermaid
flowchart TD
    A[Profile Analysis] --> B{Skills < 5?}
    B -->|Yes| C[Add Skills Suggestion]
    B -->|No| D{Education Empty?}
    
    D -->|Yes| E[Add Education Suggestion]
    D -->|No| F{Resume Missing?}
    
    F -->|Yes| G[Add Resume Suggestion]
    F -->|No| H{Internship Title Missing?}
    
    H -->|Yes| I[Add Internship Suggestion]
    H -->|No| J{Location Missing?}
    
    J -->|Yes| K[Add Location Suggestion]
    J -->|No| L[No Suggestions Needed]
    
    C --> M[Return Suggestions Array]
    E --> M
    G --> M
    I --> M
    K --> M
    L --> M
```

## 📈 Score Interpretation Matrix

```mermaid
graph LR
    A[Score Range] --> B[Color Code]
    A --> C[Label]
    A --> D[Action Required]
    
    B --> B1[90-100: Green]
    B --> B2[80-89: Green]
    B --> B3[70-79: Yellow]
    B --> B4[60-69: Yellow]
    B --> B5[50-59: Orange]
    B --> B6[0-49: Red]
    
    C --> C1[90-100: Excellent]
    C --> C2[80-89: Very Good]
    C --> C3[70-79: Good]
    C --> C4[60-69: Fair]
    C --> C5[50-59: Poor]
    C --> C6[0-49: Very Poor]
    
    D --> D1[90-100: Maintain]
    D --> D2[80-89: Minor Optimizations]
    D --> D3[70-79: Moderate Improvements]
    D --> D4[60-69: Significant Work]
    D --> D5[50-59: Major Overhaul]
    D --> D6[0-49: Complete Rebuild]
```

## 🚀 Performance Optimization Flow

```mermaid
flowchart TD
    A[Score Calculation Request] --> B{Score Cached?}
    B -->|Yes| C[Return Cached Score]
    B -->|No| D[Calculate New Score]
    
    D --> E[Database Update]
    E --> F[Cache Score]
    F --> G[Return Score]
    
    G --> H[Generate Suggestions]
    H --> I[Update Analytics]
    I --> J[Complete Response]
```

This flowchart provides a comprehensive visual representation of how the ATS scoring algorithm processes profile data and generates scores and suggestions for profile optimization.
