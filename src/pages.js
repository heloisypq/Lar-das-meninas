const Database = require('./database/db');
const saveOrphanage = require('./database/saveOrphanage');

module.exports = {

    index(req, res) {
        return res.render('index');
    },

    async orphanage(req, res) {
        const id = req.query.id;

         try {
            const db = await Database;
            const results = await db.all(`SELECT * FROM orphanages WHERE id = "${id}"`)
            console.log(results[0])
            const orphanage = results[0];

            orphanage.images = orphanage.images.split(",")
            orphanage.firstImage = orphanage.images[0]

            console.log(orphanage.open_on_weekends)

            // Fazer um if ternário nesse bloco. 
            if(orphanage.open_on_weekends == "0") {
                orphanage.open_on_weekends = false
            } else {
                orphanage.open_on_weekends = true
            }

            // console.log(orphanage.open_on_weekends)
            
            return res.render('orphanage', {orphanage: orphanage})

        } catch (error) {
            console.log(error)
            return res.send(' Erro no banco de dados!')
        }
    },
    async orphanages(req, res) {
        try {
        const db = await Database;
        const orphanages = await db.all("SELECT * FROM orphanages")
        return res.render('orphanages', { orphanages });
        } catch (error) {
            console.log(error)
            return res.send(' Erro no banco de dados!');
        }
    },
    createOrphanage(req, res) {
        return res.render('create-orphanage')
    },
    async update(req, res) {
        try {
            const db = await Database;
            //const modify = await db.exec("DELETE FROM orphanages WHERE id = '2'")
            //const modify = await db.exec("UPDATE orphanages SET lat='-8.755555' WHERE id='2'")
                console.log(modify)
            return res.send(' Olá. ');
            } catch (error) {
                console.log(error)
                return res.send(' Erro no banco de dados!');
            }
    },

    async saveOrphanage(req, res) {
        //console.log(req.body)
        const fields = req.body

        // Validar se todos os campos foram preenchidos.
        //console.log(object.values(fields))
        //console.log(object.values(fields).includes(''))

        if(Object.values(fields).includes('')) {
            return res.send(" Todos os campos devem ser preenchidos.")
        }
        
        try {
        // Salvar um orfanato.
        const db = await Database
        await saveOrphanage(db, {
            lat: fields.lat,
            lng: fields.lng,
            name: fields.name,
            about: fields.about,
            whatsapp: fields.whatsapp,
            images: fields.images.toString(),
            instructions: fields.instructions,
            opening_hours: fields.opening_hours,
            open_on_weekends: fields.open_on_weekends,
        })

        // Redirecionamento.
        return res.redirect('/orphanages')
        } catch (error) {
            console.log(error)
            return res.send(' Erro no banco de dados!')
        }
    }
}