
//implement the header check for college header
export default function (req, res, next) {
const header = req.header('x-api-key')

if (!header) {
    return res.status(401).send({
        errors: [
            {
                status: '401',
                title: 'Authentication failed',
                description: 'Missing your college API key',
            }
        ],
    })
}
try {
    //TO DO= IMPLEMENT A LOGIC TO CHECK IF THE USER IS US.
    next()
} catch (err) {
    res.status(400).send({
        errors: [
          {
            status: '400',
            title: 'Validation Error',
            description: 'Invalid college API key',
          },
        ],
      })
}   

}