from typing import List


def reverse_reasoning(parent_real: float, obs: float, cpts: List[float], decimal: int = 4):
    # cpts = [P(C|A,B), P(C|A,not(B)), P(C|not(A),B), P(C|not(A),not(B))]
    # parent_real = A
    tu = obs - (cpts[1] * parent_real + cpts[3] * (1 - parent_real))
    mau = (cpts[0] * parent_real + cpts[2] * (1 - parent_real)) - (cpts[1] * parent_real + cpts[3] * (1 - parent_real))
    return round(tu / mau, decimal)


print(reverse_reasoning(0.7, 0.5, [0.5, 0.4, 0, 0.75]))
