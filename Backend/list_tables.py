import psycopg2

db_url = "postgresql://unicraft_db_sl3v_user:ePN5b0hUT5elsbPQtrm2gTKVeWPfb8ZT@dpg-d2uk4ebuibrs73fok5eg-a.oregon-postgres.render.com/unicraft_db_sl3v"

try:
    print("Connecting to the database...")
    conn = psycopg2.connect(db_url)
    print("Connection successful.")
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = cur.fetchall()
    cur.close()
    conn.close()

    if tables:
        print("\nHere are the tables in your database:")
        for table in tables:
            print(f"- {table[0]}")
    else:
        print("No tables found in the 'public' schema.")

except Exception as e:
    print(f"An error occurred: {e}")