from src.libraries.psql import WLDB


def add(fields):
    cursor = WLDB.cursor()
    query = """
        INSERT INTO public."ClientErrors" (
            message,
            url,
            line,
            ip,
            useragent,
            created
        ) VALUES (%s,%s,%s,%s,%s,%s)
    """

    cursor.execute(query,fields)
    WLDB.commit()
    cursor.close()
