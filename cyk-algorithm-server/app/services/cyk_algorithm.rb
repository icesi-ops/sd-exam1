
class CykService

    # Builder or constructor as java language that
    # let us instantiate an instance of this CykService
    # in other files of the application
    # Input:
    # +grammar+:: Base on readme template or type it could be modeled as a json object
    #             with specific properties such as producer and products.
    # +word+:: The string or sequence of terminal that we want to llok for in the grammar
    def initialize(grammar, word)
        @grammar = grammar
        @word = word
    end
    
    # CYK Algorithm base on TI document
    # In order to apply CYK algorithm to a grammar, it must be in 
    # Chomsky Normal Form. It uses a dynamic programming algorithm to 
    # tell whether a string is in the language of a grammar.
    # Output:
    # +boolean+:: w ∈ L(G)siys ́olosiS ∈ X1n.
    def algorithm
        # Gets matrix size base in word provide by client app
        n = @word.length
        # Create n * n table or multi-dimesional array
        grid = Array.new(n) { Array.new(n)}
        # Fill first column looking its corresponding producer of each terminal
        @word.split("").each_index{ |i|
            grid[i][0] = self.getProducers(@word[i])
        }
        # 
        (1..n-1).each do |j|   # 0 index adpater (j=n)
            (0..n-j-1).each do |i| # 0 index adapter (1 <= i <= n-j+1)
                temp = Array.new() # Sets of elements such as B ∈ X_ik and C ∈ X_(i+k)(j-k)
                (0..j-1).each do |k| # 0 index adapter (1 <= k < j-1)
                    temp.push(self.concatenate(grid[i][k],grid[i+k+1][j-k-1])) # Push works like a union between concatenates
                end  
                prop = Array.new() # Set of variables A -> a_i -> BC 
                temp.map{|e| e.split().map{|element| prop.push(self.getProducers(element))}}
                grid[i][j] = prop
            end
        end
        puts(grid) # Debugging Result
        return [(grid[0][n-1].join.include? 'S'), grid]
    end

    # Gets the producer of an specific product or terminal
    # +product+:: String != '' that we are lookin for
    # Output: An array of the producers of the product in parameter
    # Considerations it returns an empty set or array if it does not
    # find any match in grammar
    private def getProducers(product)
        return @grammar.select{|element| 
            element[:products].include?(product)}.map{|element| 
                element[:producer]}
    end

    # Private function that concatenates two sets of productions
    # Just making a n^2 combination of the array as arguments of the
    # method
    # Input:
    # +prefix+:: Array of elements or producers of the X_i,k postion
    # +sufix+:: Array of elements or producers of the X_(i+k),(j-k) postion
    # Output: We are returning a string of elements separated by spaces
    # due to include method look for specific values in array so that is why
    # is better return a string
    private def concatenate(prefix, sufix)
        pre = prefix.dup # All in ruby is an object so we are passing the references
        su = sufix.dup # and we do not want to modify its values so that is why we copy
        arr = ''
        space = ''
        if (pre and su)
            pre.each_index{|productionP| 
                su.each_index{|productionS| 
                    begin
                        # Concatenation with a string
                        arr += space + pre[productionP] + su[productionS]
                    rescue
                        begin
                            # Concatenation with an array
                            arr += space + pre[productionP][0] + su[productionS][0]
                        rescue
                            # Concatenation with a nil value (empty set)
                            arr += space
                        end
                    end
                    space = ' '
            }}
            return arr
        end
        return space
    end

end
