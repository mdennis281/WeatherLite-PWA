import functools
import time


"""
    Timer Decorator
    Description:
        Times functions as a decorator
    Returns:
        Tuple containing function result and runtime
    """
def Timer(func):

    @functools.wraps(func)
    def wrapper_timer(*args,**kwargs):
        startTime = time.perf_counter()
        value = func(*args,**kwargs) #run fxn
        endTime = time.perf_counter()
        runTime = endTime-startTime
        return (value,runTime)
    return wrapper_timer
