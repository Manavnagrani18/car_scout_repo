from typing import Callable, Literal

import numpy as np
from numpy import ndarray
from scipy.optimize import linear_sum_assignment as linear_sum_assignment

from ..._typing import Float
from ...utils.validation import check_array as check_array, check_consistent_length as check_consistent_length

__all__ = ["consensus_score"]

def consensus_score(
    a: tuple[ndarray, ndarray] | tuple[int, int],
    b: tuple[ndarray, ndarray] | tuple[int, int],
    *,
    similarity: Literal["jaccard"] | Callable = "jaccard",
) -> Float: ...
