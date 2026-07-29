const sql = require('mssql');

module.exports = async function (context, req) {
    const { TournamentId, CountryId, BetAmount } = req.body;

    if (!TournamentId || !CountryId || !BetAmount) {
        context.res = { status: 400, body: "Missing parameters" };
        return;
    }

    try {
        const pool = await sql.connect(process.env.DB_CONNECTION);

        const result = await pool.request()
            .input("TournamentId", sql.Int, TournamentId)
            .input("CountryId", sql.Int, CountryId)
            .input("BetAmount", sql.Int, BetAmount)
            .query(`
                INSERT INTO Votes (TournamentId, CountryId, BetAmount, UserId)
                VALUES (@TournamentId, @CountryId, @BetAmount, 1);

                SELECT SCOPE_IDENTITY() AS VoteId;
            `);

        context.res = {
            status: 200,
            body: { VoteId: result.recordset[0].VoteId }
        };
    } catch (err) {
        context.res = { status: 500, body: err.toString() };
    }
};
