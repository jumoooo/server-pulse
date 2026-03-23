# Plan Evaluation Formula

## Quality Score (0-100)

- **Requirements Coverage (0-40)**: All explicit requirements 40, most 25-35, some 10-20, many missing 0-10
- **Completeness (0-30)**: All steps 30, most 20-25, some 10-15, many missing 0-10
- **Clarity (0-30)**: All clear 30, most 20-25, some vague 10-15, many vague 0-10

## Efficiency Score (0-100)

- **Step Optimization (0-40)**: Minimal steps 40, reasonable 25-35, inefficient 10-20, very inefficient 0-10
- **Time Accuracy (0-30)**: Realistic 30, generally 20-25, somewhat 10-15, very unrealistic 0-10
- **Resource Utilization (0-30)**: Optimal 30, good 20-25, inefficient 10-15, very inefficient 0-10

## Stability Score (0-100)

- **Dependency Risk (0-40)**: No conflicts 40, low 25-35, medium 15-25, high 0-15
- **Rollback (0-30)**: Easy 30, some 20-25, limited 10-15, difficult 0-10
- **Error Handling (0-30)**: Comprehensive 30, basic 20-25, minimal 10-15, none 0-10

## Total Score

Total = (Quality × 0.4) + (Efficiency × 0.35) + (Stability × 0.25)
