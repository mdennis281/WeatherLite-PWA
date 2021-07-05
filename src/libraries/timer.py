import functools
import time


"""
    Timer Decorator
    Description:
        times functions as a decorator
    Optional kwargs:
        outPrint
            Default: False
            Input: bool
            Behavior: if set to True, will print timed fxn
        outFile
            Default: False
            Input: string (filepath)
            Behavior: if defined, will append timed result to file
        outReturn
            Default: False
            Input: bool
            Behavior: if set to True, replace return with float val of runtime
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
